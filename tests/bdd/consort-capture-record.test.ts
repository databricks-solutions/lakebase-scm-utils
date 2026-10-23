// The per-test reporter (consort-capture.ts) RECORDS a durable `test.result` into the agent-log the
// moment each test finishes — not a cycle-end batch — so the dashboard lights each bubble live as it
// runs, scrubbing lights each test AT its real run position, and a replay of the recording does the
// same. This verifies the recorded event: schema-shaped like the kit's emitAgentLogEvent output,
// attributed to the owning story via the on-disk test-lists, with the real timestamp; a reused id is
// disambiguated by scenario_file; an unattributable id is skipped (never mis-keyed); and the corpus
// mirror lands when a recording is in flight.

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { recordTestResultEvent } from "../../templates/project/common/consort-capture";

let root: string;
let consortDir: string;

function writeStoryList(feature: string, story: string, items: Array<{ id: string; ac_id: string; scenario_file?: string }>): void {
  const dir = join(consortDir, "features", feature, "stories", story);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "test-list-per-story.json"), JSON.stringify({ feature_id: feature, story_id: story, items }, null, 2) + "\n");
}

function agentLogEvents(dir: string): Array<Record<string, unknown>> {
  const f = join(dir, "agent-log.jsonl");
  if (!existsSync(f)) return [];
  return readFileSync(f, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l));
}

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), "capture-record-"));
  consortDir = join(root, ".consort");
  mkdirSync(consortDir, { recursive: true });
});
afterEach(() => rmSync(root, { recursive: true, force: true }));

describe("recordTestResultEvent: durable per-test test.result at run time", () => {
  it("records a schema-shaped test.result attributed to the owning story, with the real ts", () => {
    writeStoryList("F6", "S1", [{ id: "T5", ac_id: "AC1", scenario_file: "tests/test_split.py" }]);
    recordTestResultEvent(consortDir, "T5", "green", "tests/test_split.py", "2026-10-23T01:02:03.000Z");
    const evts = agentLogEvents(consortDir).filter((e) => e.event === "test.result");
    expect(evts).toHaveLength(1);
    const e = evts[0];
    expect(e.timestamp).toBe("2026-10-23T01:02:03.000Z");
    expect(e.level).toBe("info");
    expect(e.event).toBe("test.result");
    expect(e.message).toBe("TEST T5 green");
    const md = e.metadata as Record<string, unknown>;
    expect(md).toMatchObject({ feature_id: "F6", test_id: "T5", status: "green", story_id: "S1", ac_id: "AC1" });
  });

  it("disambiguates a reused id by scenario_file, and skips when unresolvable (never mis-keys)", () => {
    // T9 exists in two stories with different files.
    writeStoryList("F1", "S2", [{ id: "T9", ac_id: "AC1", scenario_file: "client/tests/e2e/a.spec.ts" }]);
    writeStoryList("F6", "S3", [{ id: "T9", ac_id: "AC2", scenario_file: "client/tests/e2e/b.spec.ts" }]);
    recordTestResultEvent(consortDir, "T9", "green", "client/tests/e2e/b.spec.ts", "2026-10-23T01:00:00.000Z");
    const first = agentLogEvents(consortDir).filter((e) => e.event === "test.result");
    expect(first).toHaveLength(1);
    expect((first[0].metadata as Record<string, unknown>).story_id).toBe("S3"); // matched by file

    // A file matching NEITHER owner AND no next.json -> cannot resolve -> skip (no mis-attributed event).
    recordTestResultEvent(consortDir, "T9", "red", "client/tests/e2e/unrelated.spec.ts", "2026-10-23T01:00:05.000Z");
    expect(agentLogEvents(consortDir).filter((e) => e.event === "test.result")).toHaveLength(1);
  });

  it("falls back to the currently-building feature (next.json) for a reused id whose file pins no owner", () => {
    // The real cross-feature collision: F1/S2's T9 is a client e2e spec (has a scenario_file); F6/S3's
    // T9 is a fitness/behavior test (NO scenario_file). During F6's build the full suite runs both: F1's
    // spec resolves to itself by file; F6's fitness test runs from a pytest file that matches no
    // scenario_file -> must attribute to the active feature (F6), not drop the green.
    writeStoryList("F1", "S2", [{ id: "T9", ac_id: "AC1", scenario_file: "client/tests/e2e/a.spec.ts" }]);
    writeStoryList("F6", "S3", [{ id: "T9", ac_id: "AC2" }]); // fitness: no scenario_file
    writeFileSync(join(consortDir, "next.json"), JSON.stringify({ feature: "F6" }) + "\n");
    // F1's own spec still resolves to F1 by file match (sibling feature unaffected by the fallback).
    recordTestResultEvent(consortDir, "T9", "green", "client/tests/e2e/a.spec.ts", "2026-10-23T02:00:00.000Z");
    // F6's fitness test (pytest file, matches no scenario_file) -> active-feature fallback -> F6/S3.
    recordTestResultEvent(consortDir, "T9", "green", "tests/test_contract.py", "2026-10-23T02:00:05.000Z");
    const evts = agentLogEvents(consortDir).filter((e) => e.event === "test.result");
    expect(evts).toHaveLength(2);
    expect((evts[0].metadata as Record<string, unknown>).feature_id).toBe("F1");
    expect((evts[1].metadata as Record<string, unknown>)).toMatchObject({ feature_id: "F6", story_id: "S3" });
  });

  it("mirrors the recorded event into the corpus when LAKEBASE_CONSORT_RECORD_DIR is set", () => {
    writeStoryList("F6", "S1", [{ id: "T5", ac_id: "AC1" }]);
    const recordDir = join(root, "corpus");
    const prev = process.env.LAKEBASE_CONSORT_RECORD_DIR;
    process.env.LAKEBASE_CONSORT_RECORD_DIR = recordDir;
    try {
      recordTestResultEvent(consortDir, "T5", "red", "tests/test_split.py", "2026-10-23T01:02:03.000Z");
    } finally {
      if (prev === undefined) delete process.env.LAKEBASE_CONSORT_RECORD_DIR;
      else process.env.LAKEBASE_CONSORT_RECORD_DIR = prev;
    }
    const mirrored = agentLogEvents(recordDir).filter((e) => e.event === "test.result");
    expect(mirrored).toHaveLength(1);
    expect(mirrored[0].message).toBe("TEST T5 red");
  });
});
