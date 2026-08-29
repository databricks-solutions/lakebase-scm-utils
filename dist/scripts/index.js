var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/tsup/assets/esm_shims.js
import path from "path";
import { fileURLToPath } from "url";
var init_esm_shims = __esm({
  "node_modules/tsup/assets/esm_shims.js"() {
    "use strict";
  }
});

// node_modules/fast-content-type-parse/index.js
var require_fast_content_type_parse = __commonJS({
  "node_modules/fast-content-type-parse/index.js"(exports, module) {
    "use strict";
    init_esm_shims();
    var NullObject = function NullObject2() {
    };
    NullObject.prototype = /* @__PURE__ */ Object.create(null);
    var paramRE = /; *([!#$%&'*+.^\w`|~-]+)=("(?:[\v\u0020\u0021\u0023-\u005b\u005d-\u007e\u0080-\u00ff]|\\[\v\u0020-\u00ff])*"|[!#$%&'*+.^\w`|~-]+) */gu;
    var quotedPairRE = /\\([\v\u0020-\u00ff])/gu;
    var mediaTypeRE = /^[!#$%&'*+.^\w|~-]+\/[!#$%&'*+.^\w|~-]+$/u;
    var defaultContentType = { type: "", parameters: new NullObject() };
    Object.freeze(defaultContentType.parameters);
    Object.freeze(defaultContentType);
    function parse2(header) {
      if (typeof header !== "string") {
        throw new TypeError("argument header is required and must be a string");
      }
      let index = header.indexOf(";");
      const type = index !== -1 ? header.slice(0, index).trim() : header.trim();
      if (mediaTypeRE.test(type) === false) {
        throw new TypeError("invalid media type");
      }
      const result = {
        type: type.toLowerCase(),
        parameters: new NullObject()
      };
      if (index === -1) {
        return result;
      }
      let key;
      let match;
      let value;
      paramRE.lastIndex = index;
      while (match = paramRE.exec(header)) {
        if (match.index !== index) {
          throw new TypeError("invalid parameter format");
        }
        index += match[0].length;
        key = match[1].toLowerCase();
        value = match[2];
        if (value[0] === '"') {
          value = value.slice(1, value.length - 1);
          quotedPairRE.test(value) && (value = value.replace(quotedPairRE, "$1"));
        }
        result.parameters[key] = value;
      }
      if (index !== header.length) {
        throw new TypeError("invalid parameter format");
      }
      return result;
    }
    function safeParse2(header) {
      if (typeof header !== "string") {
        return defaultContentType;
      }
      let index = header.indexOf(";");
      const type = index !== -1 ? header.slice(0, index).trim() : header.trim();
      if (mediaTypeRE.test(type) === false) {
        return defaultContentType;
      }
      const result = {
        type: type.toLowerCase(),
        parameters: new NullObject()
      };
      if (index === -1) {
        return result;
      }
      let key;
      let match;
      let value;
      paramRE.lastIndex = index;
      while (match = paramRE.exec(header)) {
        if (match.index !== index) {
          return defaultContentType;
        }
        index += match[0].length;
        key = match[1].toLowerCase();
        value = match[2];
        if (value[0] === '"') {
          value = value.slice(1, value.length - 1);
          quotedPairRE.test(value) && (value = value.replace(quotedPairRE, "$1"));
        }
        result.parameters[key] = value;
      }
      if (index !== header.length) {
        return defaultContentType;
      }
      return result;
    }
    module.exports.default = { parse: parse2, safeParse: safeParse2 };
    module.exports.parse = parse2;
    module.exports.safeParse = safeParse2;
    module.exports.defaultContentType = defaultContentType;
  }
});

// node_modules/bottleneck/light.js
var require_light = __commonJS({
  "node_modules/bottleneck/light.js"(exports, module) {
    "use strict";
    init_esm_shims();
    (function(global2, factory) {
      typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : global2.Bottleneck = factory();
    })(exports, (function() {
      "use strict";
      var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
      function getCjsExportFromNamespace(n) {
        return n && n["default"] || n;
      }
      var load = function(received, defaults, onto = {}) {
        var k, ref, v;
        for (k in defaults) {
          v = defaults[k];
          onto[k] = (ref = received[k]) != null ? ref : v;
        }
        return onto;
      };
      var overwrite = function(received, defaults, onto = {}) {
        var k, v;
        for (k in received) {
          v = received[k];
          if (defaults[k] !== void 0) {
            onto[k] = v;
          }
        }
        return onto;
      };
      var parser = {
        load,
        overwrite
      };
      var DLList;
      DLList = class DLList {
        constructor(incr, decr) {
          this.incr = incr;
          this.decr = decr;
          this._first = null;
          this._last = null;
          this.length = 0;
        }
        push(value) {
          var node;
          this.length++;
          if (typeof this.incr === "function") {
            this.incr();
          }
          node = {
            value,
            prev: this._last,
            next: null
          };
          if (this._last != null) {
            this._last.next = node;
            this._last = node;
          } else {
            this._first = this._last = node;
          }
          return void 0;
        }
        shift() {
          var value;
          if (this._first == null) {
            return;
          } else {
            this.length--;
            if (typeof this.decr === "function") {
              this.decr();
            }
          }
          value = this._first.value;
          if ((this._first = this._first.next) != null) {
            this._first.prev = null;
          } else {
            this._last = null;
          }
          return value;
        }
        first() {
          if (this._first != null) {
            return this._first.value;
          }
        }
        getArray() {
          var node, ref, results;
          node = this._first;
          results = [];
          while (node != null) {
            results.push((ref = node, node = node.next, ref.value));
          }
          return results;
        }
        forEachShift(cb) {
          var node;
          node = this.shift();
          while (node != null) {
            cb(node), node = this.shift();
          }
          return void 0;
        }
        debug() {
          var node, ref, ref1, ref2, results;
          node = this._first;
          results = [];
          while (node != null) {
            results.push((ref = node, node = node.next, {
              value: ref.value,
              prev: (ref1 = ref.prev) != null ? ref1.value : void 0,
              next: (ref2 = ref.next) != null ? ref2.value : void 0
            }));
          }
          return results;
        }
      };
      var DLList_1 = DLList;
      var Events;
      Events = class Events {
        constructor(instance) {
          this.instance = instance;
          this._events = {};
          if (this.instance.on != null || this.instance.once != null || this.instance.removeAllListeners != null) {
            throw new Error("An Emitter already exists for this object");
          }
          this.instance.on = (name, cb) => {
            return this._addListener(name, "many", cb);
          };
          this.instance.once = (name, cb) => {
            return this._addListener(name, "once", cb);
          };
          this.instance.removeAllListeners = (name = null) => {
            if (name != null) {
              return delete this._events[name];
            } else {
              return this._events = {};
            }
          };
        }
        _addListener(name, status, cb) {
          var base;
          if ((base = this._events)[name] == null) {
            base[name] = [];
          }
          this._events[name].push({ cb, status });
          return this.instance;
        }
        listenerCount(name) {
          if (this._events[name] != null) {
            return this._events[name].length;
          } else {
            return 0;
          }
        }
        async trigger(name, ...args) {
          var e, promises;
          try {
            if (name !== "debug") {
              this.trigger("debug", `Event triggered: ${name}`, args);
            }
            if (this._events[name] == null) {
              return;
            }
            this._events[name] = this._events[name].filter(function(listener) {
              return listener.status !== "none";
            });
            promises = this._events[name].map(async (listener) => {
              var e2, returned;
              if (listener.status === "none") {
                return;
              }
              if (listener.status === "once") {
                listener.status = "none";
              }
              try {
                returned = typeof listener.cb === "function" ? listener.cb(...args) : void 0;
                if (typeof (returned != null ? returned.then : void 0) === "function") {
                  return await returned;
                } else {
                  return returned;
                }
              } catch (error) {
                e2 = error;
                {
                  this.trigger("error", e2);
                }
                return null;
              }
            });
            return (await Promise.all(promises)).find(function(x) {
              return x != null;
            });
          } catch (error) {
            e = error;
            {
              this.trigger("error", e);
            }
            return null;
          }
        }
      };
      var Events_1 = Events;
      var DLList$1, Events$1, Queues;
      DLList$1 = DLList_1;
      Events$1 = Events_1;
      Queues = class Queues {
        constructor(num_priorities) {
          var i;
          this.Events = new Events$1(this);
          this._length = 0;
          this._lists = (function() {
            var j, ref, results;
            results = [];
            for (i = j = 1, ref = num_priorities; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
              results.push(new DLList$1((() => {
                return this.incr();
              }), (() => {
                return this.decr();
              })));
            }
            return results;
          }).call(this);
        }
        incr() {
          if (this._length++ === 0) {
            return this.Events.trigger("leftzero");
          }
        }
        decr() {
          if (--this._length === 0) {
            return this.Events.trigger("zero");
          }
        }
        push(job) {
          return this._lists[job.options.priority].push(job);
        }
        queued(priority) {
          if (priority != null) {
            return this._lists[priority].length;
          } else {
            return this._length;
          }
        }
        shiftAll(fn) {
          return this._lists.forEach(function(list) {
            return list.forEachShift(fn);
          });
        }
        getFirst(arr = this._lists) {
          var j, len, list;
          for (j = 0, len = arr.length; j < len; j++) {
            list = arr[j];
            if (list.length > 0) {
              return list;
            }
          }
          return [];
        }
        shiftLastFrom(priority) {
          return this.getFirst(this._lists.slice(priority).reverse()).shift();
        }
      };
      var Queues_1 = Queues;
      var BottleneckError;
      BottleneckError = class BottleneckError extends Error {
      };
      var BottleneckError_1 = BottleneckError;
      var BottleneckError$1, DEFAULT_PRIORITY, Job, NUM_PRIORITIES, parser$1;
      NUM_PRIORITIES = 10;
      DEFAULT_PRIORITY = 5;
      parser$1 = parser;
      BottleneckError$1 = BottleneckError_1;
      Job = class Job {
        constructor(task, args, options, jobDefaults, rejectOnDrop, Events2, _states, Promise2) {
          this.task = task;
          this.args = args;
          this.rejectOnDrop = rejectOnDrop;
          this.Events = Events2;
          this._states = _states;
          this.Promise = Promise2;
          this.options = parser$1.load(options, jobDefaults);
          this.options.priority = this._sanitizePriority(this.options.priority);
          if (this.options.id === jobDefaults.id) {
            this.options.id = `${this.options.id}-${this._randomIndex()}`;
          }
          this.promise = new this.Promise((_resolve, _reject) => {
            this._resolve = _resolve;
            this._reject = _reject;
          });
          this.retryCount = 0;
        }
        _sanitizePriority(priority) {
          var sProperty;
          sProperty = ~~priority !== priority ? DEFAULT_PRIORITY : priority;
          if (sProperty < 0) {
            return 0;
          } else if (sProperty > NUM_PRIORITIES - 1) {
            return NUM_PRIORITIES - 1;
          } else {
            return sProperty;
          }
        }
        _randomIndex() {
          return Math.random().toString(36).slice(2);
        }
        doDrop({ error, message = "This job has been dropped by Bottleneck" } = {}) {
          if (this._states.remove(this.options.id)) {
            if (this.rejectOnDrop) {
              this._reject(error != null ? error : new BottleneckError$1(message));
            }
            this.Events.trigger("dropped", { args: this.args, options: this.options, task: this.task, promise: this.promise });
            return true;
          } else {
            return false;
          }
        }
        _assertStatus(expected) {
          var status;
          status = this._states.jobStatus(this.options.id);
          if (!(status === expected || expected === "DONE" && status === null)) {
            throw new BottleneckError$1(`Invalid job status ${status}, expected ${expected}. Please open an issue at https://github.com/SGrondin/bottleneck/issues`);
          }
        }
        doReceive() {
          this._states.start(this.options.id);
          return this.Events.trigger("received", { args: this.args, options: this.options });
        }
        doQueue(reachedHWM, blocked) {
          this._assertStatus("RECEIVED");
          this._states.next(this.options.id);
          return this.Events.trigger("queued", { args: this.args, options: this.options, reachedHWM, blocked });
        }
        doRun() {
          if (this.retryCount === 0) {
            this._assertStatus("QUEUED");
            this._states.next(this.options.id);
          } else {
            this._assertStatus("EXECUTING");
          }
          return this.Events.trigger("scheduled", { args: this.args, options: this.options });
        }
        async doExecute(chained, clearGlobalState, run, free) {
          var error, eventInfo, passed;
          if (this.retryCount === 0) {
            this._assertStatus("RUNNING");
            this._states.next(this.options.id);
          } else {
            this._assertStatus("EXECUTING");
          }
          eventInfo = { args: this.args, options: this.options, retryCount: this.retryCount };
          this.Events.trigger("executing", eventInfo);
          try {
            passed = await (chained != null ? chained.schedule(this.options, this.task, ...this.args) : this.task(...this.args));
            if (clearGlobalState()) {
              this.doDone(eventInfo);
              await free(this.options, eventInfo);
              this._assertStatus("DONE");
              return this._resolve(passed);
            }
          } catch (error1) {
            error = error1;
            return this._onFailure(error, eventInfo, clearGlobalState, run, free);
          }
        }
        doExpire(clearGlobalState, run, free) {
          var error, eventInfo;
          if (this._states.jobStatus(this.options.id === "RUNNING")) {
            this._states.next(this.options.id);
          }
          this._assertStatus("EXECUTING");
          eventInfo = { args: this.args, options: this.options, retryCount: this.retryCount };
          error = new BottleneckError$1(`This job timed out after ${this.options.expiration} ms.`);
          return this._onFailure(error, eventInfo, clearGlobalState, run, free);
        }
        async _onFailure(error, eventInfo, clearGlobalState, run, free) {
          var retry2, retryAfter;
          if (clearGlobalState()) {
            retry2 = await this.Events.trigger("failed", error, eventInfo);
            if (retry2 != null) {
              retryAfter = ~~retry2;
              this.Events.trigger("retry", `Retrying ${this.options.id} after ${retryAfter} ms`, eventInfo);
              this.retryCount++;
              return run(retryAfter);
            } else {
              this.doDone(eventInfo);
              await free(this.options, eventInfo);
              this._assertStatus("DONE");
              return this._reject(error);
            }
          }
        }
        doDone(eventInfo) {
          this._assertStatus("EXECUTING");
          this._states.next(this.options.id);
          return this.Events.trigger("done", eventInfo);
        }
      };
      var Job_1 = Job;
      var BottleneckError$2, LocalDatastore, parser$2;
      parser$2 = parser;
      BottleneckError$2 = BottleneckError_1;
      LocalDatastore = class LocalDatastore {
        constructor(instance, storeOptions, storeInstanceOptions) {
          this.instance = instance;
          this.storeOptions = storeOptions;
          this.clientId = this.instance._randomIndex();
          parser$2.load(storeInstanceOptions, storeInstanceOptions, this);
          this._nextRequest = this._lastReservoirRefresh = this._lastReservoirIncrease = Date.now();
          this._running = 0;
          this._done = 0;
          this._unblockTime = 0;
          this.ready = this.Promise.resolve();
          this.clients = {};
          this._startHeartbeat();
        }
        _startHeartbeat() {
          var base;
          if (this.heartbeat == null && (this.storeOptions.reservoirRefreshInterval != null && this.storeOptions.reservoirRefreshAmount != null || this.storeOptions.reservoirIncreaseInterval != null && this.storeOptions.reservoirIncreaseAmount != null)) {
            return typeof (base = this.heartbeat = setInterval(() => {
              var amount, incr, maximum, now, reservoir;
              now = Date.now();
              if (this.storeOptions.reservoirRefreshInterval != null && now >= this._lastReservoirRefresh + this.storeOptions.reservoirRefreshInterval) {
                this._lastReservoirRefresh = now;
                this.storeOptions.reservoir = this.storeOptions.reservoirRefreshAmount;
                this.instance._drainAll(this.computeCapacity());
              }
              if (this.storeOptions.reservoirIncreaseInterval != null && now >= this._lastReservoirIncrease + this.storeOptions.reservoirIncreaseInterval) {
                ({
                  reservoirIncreaseAmount: amount,
                  reservoirIncreaseMaximum: maximum,
                  reservoir
                } = this.storeOptions);
                this._lastReservoirIncrease = now;
                incr = maximum != null ? Math.min(amount, maximum - reservoir) : amount;
                if (incr > 0) {
                  this.storeOptions.reservoir += incr;
                  return this.instance._drainAll(this.computeCapacity());
                }
              }
            }, this.heartbeatInterval)).unref === "function" ? base.unref() : void 0;
          } else {
            return clearInterval(this.heartbeat);
          }
        }
        async __publish__(message) {
          await this.yieldLoop();
          return this.instance.Events.trigger("message", message.toString());
        }
        async __disconnect__(flush) {
          await this.yieldLoop();
          clearInterval(this.heartbeat);
          return this.Promise.resolve();
        }
        yieldLoop(t = 0) {
          return new this.Promise(function(resolve2, reject) {
            return setTimeout(resolve2, t);
          });
        }
        computePenalty() {
          var ref;
          return (ref = this.storeOptions.penalty) != null ? ref : 15 * this.storeOptions.minTime || 5e3;
        }
        async __updateSettings__(options) {
          await this.yieldLoop();
          parser$2.overwrite(options, options, this.storeOptions);
          this._startHeartbeat();
          this.instance._drainAll(this.computeCapacity());
          return true;
        }
        async __running__() {
          await this.yieldLoop();
          return this._running;
        }
        async __queued__() {
          await this.yieldLoop();
          return this.instance.queued();
        }
        async __done__() {
          await this.yieldLoop();
          return this._done;
        }
        async __groupCheck__(time) {
          await this.yieldLoop();
          return this._nextRequest + this.timeout < time;
        }
        computeCapacity() {
          var maxConcurrent, reservoir;
          ({ maxConcurrent, reservoir } = this.storeOptions);
          if (maxConcurrent != null && reservoir != null) {
            return Math.min(maxConcurrent - this._running, reservoir);
          } else if (maxConcurrent != null) {
            return maxConcurrent - this._running;
          } else if (reservoir != null) {
            return reservoir;
          } else {
            return null;
          }
        }
        conditionsCheck(weight) {
          var capacity;
          capacity = this.computeCapacity();
          return capacity == null || weight <= capacity;
        }
        async __incrementReservoir__(incr) {
          var reservoir;
          await this.yieldLoop();
          reservoir = this.storeOptions.reservoir += incr;
          this.instance._drainAll(this.computeCapacity());
          return reservoir;
        }
        async __currentReservoir__() {
          await this.yieldLoop();
          return this.storeOptions.reservoir;
        }
        isBlocked(now) {
          return this._unblockTime >= now;
        }
        check(weight, now) {
          return this.conditionsCheck(weight) && this._nextRequest - now <= 0;
        }
        async __check__(weight) {
          var now;
          await this.yieldLoop();
          now = Date.now();
          return this.check(weight, now);
        }
        async __register__(index, weight, expiration) {
          var now, wait2;
          await this.yieldLoop();
          now = Date.now();
          if (this.conditionsCheck(weight)) {
            this._running += weight;
            if (this.storeOptions.reservoir != null) {
              this.storeOptions.reservoir -= weight;
            }
            wait2 = Math.max(this._nextRequest - now, 0);
            this._nextRequest = now + wait2 + this.storeOptions.minTime;
            return {
              success: true,
              wait: wait2,
              reservoir: this.storeOptions.reservoir
            };
          } else {
            return {
              success: false
            };
          }
        }
        strategyIsBlock() {
          return this.storeOptions.strategy === 3;
        }
        async __submit__(queueLength, weight) {
          var blocked, now, reachedHWM;
          await this.yieldLoop();
          if (this.storeOptions.maxConcurrent != null && weight > this.storeOptions.maxConcurrent) {
            throw new BottleneckError$2(`Impossible to add a job having a weight of ${weight} to a limiter having a maxConcurrent setting of ${this.storeOptions.maxConcurrent}`);
          }
          now = Date.now();
          reachedHWM = this.storeOptions.highWater != null && queueLength === this.storeOptions.highWater && !this.check(weight, now);
          blocked = this.strategyIsBlock() && (reachedHWM || this.isBlocked(now));
          if (blocked) {
            this._unblockTime = now + this.computePenalty();
            this._nextRequest = this._unblockTime + this.storeOptions.minTime;
            this.instance._dropAllQueued();
          }
          return {
            reachedHWM,
            blocked,
            strategy: this.storeOptions.strategy
          };
        }
        async __free__(index, weight) {
          await this.yieldLoop();
          this._running -= weight;
          this._done += weight;
          this.instance._drainAll(this.computeCapacity());
          return {
            running: this._running
          };
        }
      };
      var LocalDatastore_1 = LocalDatastore;
      var BottleneckError$3, States;
      BottleneckError$3 = BottleneckError_1;
      States = class States {
        constructor(status1) {
          this.status = status1;
          this._jobs = {};
          this.counts = this.status.map(function() {
            return 0;
          });
        }
        next(id) {
          var current, next;
          current = this._jobs[id];
          next = current + 1;
          if (current != null && next < this.status.length) {
            this.counts[current]--;
            this.counts[next]++;
            return this._jobs[id]++;
          } else if (current != null) {
            this.counts[current]--;
            return delete this._jobs[id];
          }
        }
        start(id) {
          var initial;
          initial = 0;
          this._jobs[id] = initial;
          return this.counts[initial]++;
        }
        remove(id) {
          var current;
          current = this._jobs[id];
          if (current != null) {
            this.counts[current]--;
            delete this._jobs[id];
          }
          return current != null;
        }
        jobStatus(id) {
          var ref;
          return (ref = this.status[this._jobs[id]]) != null ? ref : null;
        }
        statusJobs(status) {
          var k, pos, ref, results, v;
          if (status != null) {
            pos = this.status.indexOf(status);
            if (pos < 0) {
              throw new BottleneckError$3(`status must be one of ${this.status.join(", ")}`);
            }
            ref = this._jobs;
            results = [];
            for (k in ref) {
              v = ref[k];
              if (v === pos) {
                results.push(k);
              }
            }
            return results;
          } else {
            return Object.keys(this._jobs);
          }
        }
        statusCounts() {
          return this.counts.reduce(((acc, v, i) => {
            acc[this.status[i]] = v;
            return acc;
          }), {});
        }
      };
      var States_1 = States;
      var DLList$2, Sync;
      DLList$2 = DLList_1;
      Sync = class Sync {
        constructor(name, Promise2) {
          this.schedule = this.schedule.bind(this);
          this.name = name;
          this.Promise = Promise2;
          this._running = 0;
          this._queue = new DLList$2();
        }
        isEmpty() {
          return this._queue.length === 0;
        }
        async _tryToRun() {
          var args, cb, error, reject, resolve2, returned, task;
          if (this._running < 1 && this._queue.length > 0) {
            this._running++;
            ({ task, args, resolve: resolve2, reject } = this._queue.shift());
            cb = await (async function() {
              try {
                returned = await task(...args);
                return function() {
                  return resolve2(returned);
                };
              } catch (error1) {
                error = error1;
                return function() {
                  return reject(error);
                };
              }
            })();
            this._running--;
            this._tryToRun();
            return cb();
          }
        }
        schedule(task, ...args) {
          var promise, reject, resolve2;
          resolve2 = reject = null;
          promise = new this.Promise(function(_resolve, _reject) {
            resolve2 = _resolve;
            return reject = _reject;
          });
          this._queue.push({ task, args, resolve: resolve2, reject });
          this._tryToRun();
          return promise;
        }
      };
      var Sync_1 = Sync;
      var version = "2.19.5";
      var version$1 = {
        version
      };
      var version$2 = /* @__PURE__ */ Object.freeze({
        version,
        default: version$1
      });
      var require$$2 = () => console.log("You must import the full version of Bottleneck in order to use this feature.");
      var require$$3 = () => console.log("You must import the full version of Bottleneck in order to use this feature.");
      var require$$4 = () => console.log("You must import the full version of Bottleneck in order to use this feature.");
      var Events$2, Group, IORedisConnection$1, RedisConnection$1, Scripts$1, parser$3;
      parser$3 = parser;
      Events$2 = Events_1;
      RedisConnection$1 = require$$2;
      IORedisConnection$1 = require$$3;
      Scripts$1 = require$$4;
      Group = (function() {
        class Group2 {
          constructor(limiterOptions = {}) {
            this.deleteKey = this.deleteKey.bind(this);
            this.limiterOptions = limiterOptions;
            parser$3.load(this.limiterOptions, this.defaults, this);
            this.Events = new Events$2(this);
            this.instances = {};
            this.Bottleneck = Bottleneck_1;
            this._startAutoCleanup();
            this.sharedConnection = this.connection != null;
            if (this.connection == null) {
              if (this.limiterOptions.datastore === "redis") {
                this.connection = new RedisConnection$1(Object.assign({}, this.limiterOptions, { Events: this.Events }));
              } else if (this.limiterOptions.datastore === "ioredis") {
                this.connection = new IORedisConnection$1(Object.assign({}, this.limiterOptions, { Events: this.Events }));
              }
            }
          }
          key(key = "") {
            var ref;
            return (ref = this.instances[key]) != null ? ref : (() => {
              var limiter;
              limiter = this.instances[key] = new this.Bottleneck(Object.assign(this.limiterOptions, {
                id: `${this.id}-${key}`,
                timeout: this.timeout,
                connection: this.connection
              }));
              this.Events.trigger("created", limiter, key);
              return limiter;
            })();
          }
          async deleteKey(key = "") {
            var deleted, instance;
            instance = this.instances[key];
            if (this.connection) {
              deleted = await this.connection.__runCommand__(["del", ...Scripts$1.allKeys(`${this.id}-${key}`)]);
            }
            if (instance != null) {
              delete this.instances[key];
              await instance.disconnect();
            }
            return instance != null || deleted > 0;
          }
          limiters() {
            var k, ref, results, v;
            ref = this.instances;
            results = [];
            for (k in ref) {
              v = ref[k];
              results.push({
                key: k,
                limiter: v
              });
            }
            return results;
          }
          keys() {
            return Object.keys(this.instances);
          }
          async clusterKeys() {
            var cursor, end, found, i, k, keys, len, next, start;
            if (this.connection == null) {
              return this.Promise.resolve(this.keys());
            }
            keys = [];
            cursor = null;
            start = `b_${this.id}-`.length;
            end = "_settings".length;
            while (cursor !== 0) {
              [next, found] = await this.connection.__runCommand__(["scan", cursor != null ? cursor : 0, "match", `b_${this.id}-*_settings`, "count", 1e4]);
              cursor = ~~next;
              for (i = 0, len = found.length; i < len; i++) {
                k = found[i];
                keys.push(k.slice(start, -end));
              }
            }
            return keys;
          }
          _startAutoCleanup() {
            var base;
            clearInterval(this.interval);
            return typeof (base = this.interval = setInterval(async () => {
              var e, k, ref, results, time, v;
              time = Date.now();
              ref = this.instances;
              results = [];
              for (k in ref) {
                v = ref[k];
                try {
                  if (await v._store.__groupCheck__(time)) {
                    results.push(this.deleteKey(k));
                  } else {
                    results.push(void 0);
                  }
                } catch (error) {
                  e = error;
                  results.push(v.Events.trigger("error", e));
                }
              }
              return results;
            }, this.timeout / 2)).unref === "function" ? base.unref() : void 0;
          }
          updateSettings(options = {}) {
            parser$3.overwrite(options, this.defaults, this);
            parser$3.overwrite(options, options, this.limiterOptions);
            if (options.timeout != null) {
              return this._startAutoCleanup();
            }
          }
          disconnect(flush = true) {
            var ref;
            if (!this.sharedConnection) {
              return (ref = this.connection) != null ? ref.disconnect(flush) : void 0;
            }
          }
        }
        Group2.prototype.defaults = {
          timeout: 1e3 * 60 * 5,
          connection: null,
          Promise,
          id: "group-key"
        };
        return Group2;
      }).call(commonjsGlobal);
      var Group_1 = Group;
      var Batcher, Events$3, parser$4;
      parser$4 = parser;
      Events$3 = Events_1;
      Batcher = (function() {
        class Batcher2 {
          constructor(options = {}) {
            this.options = options;
            parser$4.load(this.options, this.defaults, this);
            this.Events = new Events$3(this);
            this._arr = [];
            this._resetPromise();
            this._lastFlush = Date.now();
          }
          _resetPromise() {
            return this._promise = new this.Promise((res, rej) => {
              return this._resolve = res;
            });
          }
          _flush() {
            clearTimeout(this._timeout);
            this._lastFlush = Date.now();
            this._resolve();
            this.Events.trigger("batch", this._arr);
            this._arr = [];
            return this._resetPromise();
          }
          add(data) {
            var ret;
            this._arr.push(data);
            ret = this._promise;
            if (this._arr.length === this.maxSize) {
              this._flush();
            } else if (this.maxTime != null && this._arr.length === 1) {
              this._timeout = setTimeout(() => {
                return this._flush();
              }, this.maxTime);
            }
            return ret;
          }
        }
        Batcher2.prototype.defaults = {
          maxTime: null,
          maxSize: null,
          Promise
        };
        return Batcher2;
      }).call(commonjsGlobal);
      var Batcher_1 = Batcher;
      var require$$4$1 = () => console.log("You must import the full version of Bottleneck in order to use this feature.");
      var require$$8 = getCjsExportFromNamespace(version$2);
      var Bottleneck2, DEFAULT_PRIORITY$1, Events$4, Job$1, LocalDatastore$1, NUM_PRIORITIES$1, Queues$1, RedisDatastore$1, States$1, Sync$1, parser$5, splice = [].splice;
      NUM_PRIORITIES$1 = 10;
      DEFAULT_PRIORITY$1 = 5;
      parser$5 = parser;
      Queues$1 = Queues_1;
      Job$1 = Job_1;
      LocalDatastore$1 = LocalDatastore_1;
      RedisDatastore$1 = require$$4$1;
      Events$4 = Events_1;
      States$1 = States_1;
      Sync$1 = Sync_1;
      Bottleneck2 = (function() {
        class Bottleneck3 {
          constructor(options = {}, ...invalid) {
            var storeInstanceOptions, storeOptions;
            this._addToQueue = this._addToQueue.bind(this);
            this._validateOptions(options, invalid);
            parser$5.load(options, this.instanceDefaults, this);
            this._queues = new Queues$1(NUM_PRIORITIES$1);
            this._scheduled = {};
            this._states = new States$1(["RECEIVED", "QUEUED", "RUNNING", "EXECUTING"].concat(this.trackDoneStatus ? ["DONE"] : []));
            this._limiter = null;
            this.Events = new Events$4(this);
            this._submitLock = new Sync$1("submit", this.Promise);
            this._registerLock = new Sync$1("register", this.Promise);
            storeOptions = parser$5.load(options, this.storeDefaults, {});
            this._store = (function() {
              if (this.datastore === "redis" || this.datastore === "ioredis" || this.connection != null) {
                storeInstanceOptions = parser$5.load(options, this.redisStoreDefaults, {});
                return new RedisDatastore$1(this, storeOptions, storeInstanceOptions);
              } else if (this.datastore === "local") {
                storeInstanceOptions = parser$5.load(options, this.localStoreDefaults, {});
                return new LocalDatastore$1(this, storeOptions, storeInstanceOptions);
              } else {
                throw new Bottleneck3.prototype.BottleneckError(`Invalid datastore type: ${this.datastore}`);
              }
            }).call(this);
            this._queues.on("leftzero", () => {
              var ref;
              return (ref = this._store.heartbeat) != null ? typeof ref.ref === "function" ? ref.ref() : void 0 : void 0;
            });
            this._queues.on("zero", () => {
              var ref;
              return (ref = this._store.heartbeat) != null ? typeof ref.unref === "function" ? ref.unref() : void 0 : void 0;
            });
          }
          _validateOptions(options, invalid) {
            if (!(options != null && typeof options === "object" && invalid.length === 0)) {
              throw new Bottleneck3.prototype.BottleneckError("Bottleneck v2 takes a single object argument. Refer to https://github.com/SGrondin/bottleneck#upgrading-to-v2 if you're upgrading from Bottleneck v1.");
            }
          }
          ready() {
            return this._store.ready;
          }
          clients() {
            return this._store.clients;
          }
          channel() {
            return `b_${this.id}`;
          }
          channel_client() {
            return `b_${this.id}_${this._store.clientId}`;
          }
          publish(message) {
            return this._store.__publish__(message);
          }
          disconnect(flush = true) {
            return this._store.__disconnect__(flush);
          }
          chain(_limiter) {
            this._limiter = _limiter;
            return this;
          }
          queued(priority) {
            return this._queues.queued(priority);
          }
          clusterQueued() {
            return this._store.__queued__();
          }
          empty() {
            return this.queued() === 0 && this._submitLock.isEmpty();
          }
          running() {
            return this._store.__running__();
          }
          done() {
            return this._store.__done__();
          }
          jobStatus(id) {
            return this._states.jobStatus(id);
          }
          jobs(status) {
            return this._states.statusJobs(status);
          }
          counts() {
            return this._states.statusCounts();
          }
          _randomIndex() {
            return Math.random().toString(36).slice(2);
          }
          check(weight = 1) {
            return this._store.__check__(weight);
          }
          _clearGlobalState(index) {
            if (this._scheduled[index] != null) {
              clearTimeout(this._scheduled[index].expiration);
              delete this._scheduled[index];
              return true;
            } else {
              return false;
            }
          }
          async _free(index, job, options, eventInfo) {
            var e, running;
            try {
              ({ running } = await this._store.__free__(index, options.weight));
              this.Events.trigger("debug", `Freed ${options.id}`, eventInfo);
              if (running === 0 && this.empty()) {
                return this.Events.trigger("idle");
              }
            } catch (error1) {
              e = error1;
              return this.Events.trigger("error", e);
            }
          }
          _run(index, job, wait2) {
            var clearGlobalState, free, run;
            job.doRun();
            clearGlobalState = this._clearGlobalState.bind(this, index);
            run = this._run.bind(this, index, job);
            free = this._free.bind(this, index, job);
            return this._scheduled[index] = {
              timeout: setTimeout(() => {
                return job.doExecute(this._limiter, clearGlobalState, run, free);
              }, wait2),
              expiration: job.options.expiration != null ? setTimeout(function() {
                return job.doExpire(clearGlobalState, run, free);
              }, wait2 + job.options.expiration) : void 0,
              job
            };
          }
          _drainOne(capacity) {
            return this._registerLock.schedule(() => {
              var args, index, next, options, queue;
              if (this.queued() === 0) {
                return this.Promise.resolve(null);
              }
              queue = this._queues.getFirst();
              ({ options, args } = next = queue.first());
              if (capacity != null && options.weight > capacity) {
                return this.Promise.resolve(null);
              }
              this.Events.trigger("debug", `Draining ${options.id}`, { args, options });
              index = this._randomIndex();
              return this._store.__register__(index, options.weight, options.expiration).then(({ success, wait: wait2, reservoir }) => {
                var empty;
                this.Events.trigger("debug", `Drained ${options.id}`, { success, args, options });
                if (success) {
                  queue.shift();
                  empty = this.empty();
                  if (empty) {
                    this.Events.trigger("empty");
                  }
                  if (reservoir === 0) {
                    this.Events.trigger("depleted", empty);
                  }
                  this._run(index, next, wait2);
                  return this.Promise.resolve(options.weight);
                } else {
                  return this.Promise.resolve(null);
                }
              });
            });
          }
          _drainAll(capacity, total = 0) {
            return this._drainOne(capacity).then((drained) => {
              var newCapacity;
              if (drained != null) {
                newCapacity = capacity != null ? capacity - drained : capacity;
                return this._drainAll(newCapacity, total + drained);
              } else {
                return this.Promise.resolve(total);
              }
            }).catch((e) => {
              return this.Events.trigger("error", e);
            });
          }
          _dropAllQueued(message) {
            return this._queues.shiftAll(function(job) {
              return job.doDrop({ message });
            });
          }
          stop(options = {}) {
            var done, waitForExecuting;
            options = parser$5.load(options, this.stopDefaults);
            waitForExecuting = (at) => {
              var finished;
              finished = () => {
                var counts;
                counts = this._states.counts;
                return counts[0] + counts[1] + counts[2] + counts[3] === at;
              };
              return new this.Promise((resolve2, reject) => {
                if (finished()) {
                  return resolve2();
                } else {
                  return this.on("done", () => {
                    if (finished()) {
                      this.removeAllListeners("done");
                      return resolve2();
                    }
                  });
                }
              });
            };
            done = options.dropWaitingJobs ? (this._run = function(index, next) {
              return next.doDrop({
                message: options.dropErrorMessage
              });
            }, this._drainOne = () => {
              return this.Promise.resolve(null);
            }, this._registerLock.schedule(() => {
              return this._submitLock.schedule(() => {
                var k, ref, v;
                ref = this._scheduled;
                for (k in ref) {
                  v = ref[k];
                  if (this.jobStatus(v.job.options.id) === "RUNNING") {
                    clearTimeout(v.timeout);
                    clearTimeout(v.expiration);
                    v.job.doDrop({
                      message: options.dropErrorMessage
                    });
                  }
                }
                this._dropAllQueued(options.dropErrorMessage);
                return waitForExecuting(0);
              });
            })) : this.schedule({
              priority: NUM_PRIORITIES$1 - 1,
              weight: 0
            }, () => {
              return waitForExecuting(1);
            });
            this._receive = function(job) {
              return job._reject(new Bottleneck3.prototype.BottleneckError(options.enqueueErrorMessage));
            };
            this.stop = () => {
              return this.Promise.reject(new Bottleneck3.prototype.BottleneckError("stop() has already been called"));
            };
            return done;
          }
          async _addToQueue(job) {
            var args, blocked, error, options, reachedHWM, shifted, strategy;
            ({ args, options } = job);
            try {
              ({ reachedHWM, blocked, strategy } = await this._store.__submit__(this.queued(), options.weight));
            } catch (error1) {
              error = error1;
              this.Events.trigger("debug", `Could not queue ${options.id}`, { args, options, error });
              job.doDrop({ error });
              return false;
            }
            if (blocked) {
              job.doDrop();
              return true;
            } else if (reachedHWM) {
              shifted = strategy === Bottleneck3.prototype.strategy.LEAK ? this._queues.shiftLastFrom(options.priority) : strategy === Bottleneck3.prototype.strategy.OVERFLOW_PRIORITY ? this._queues.shiftLastFrom(options.priority + 1) : strategy === Bottleneck3.prototype.strategy.OVERFLOW ? job : void 0;
              if (shifted != null) {
                shifted.doDrop();
              }
              if (shifted == null || strategy === Bottleneck3.prototype.strategy.OVERFLOW) {
                if (shifted == null) {
                  job.doDrop();
                }
                return reachedHWM;
              }
            }
            job.doQueue(reachedHWM, blocked);
            this._queues.push(job);
            await this._drainAll();
            return reachedHWM;
          }
          _receive(job) {
            if (this._states.jobStatus(job.options.id) != null) {
              job._reject(new Bottleneck3.prototype.BottleneckError(`A job with the same id already exists (id=${job.options.id})`));
              return false;
            } else {
              job.doReceive();
              return this._submitLock.schedule(this._addToQueue, job);
            }
          }
          submit(...args) {
            var cb, fn, job, options, ref, ref1, task;
            if (typeof args[0] === "function") {
              ref = args, [fn, ...args] = ref, [cb] = splice.call(args, -1);
              options = parser$5.load({}, this.jobDefaults);
            } else {
              ref1 = args, [options, fn, ...args] = ref1, [cb] = splice.call(args, -1);
              options = parser$5.load(options, this.jobDefaults);
            }
            task = (...args2) => {
              return new this.Promise(function(resolve2, reject) {
                return fn(...args2, function(...args3) {
                  return (args3[0] != null ? reject : resolve2)(args3);
                });
              });
            };
            job = new Job$1(task, args, options, this.jobDefaults, this.rejectOnDrop, this.Events, this._states, this.Promise);
            job.promise.then(function(args2) {
              return typeof cb === "function" ? cb(...args2) : void 0;
            }).catch(function(args2) {
              if (Array.isArray(args2)) {
                return typeof cb === "function" ? cb(...args2) : void 0;
              } else {
                return typeof cb === "function" ? cb(args2) : void 0;
              }
            });
            return this._receive(job);
          }
          schedule(...args) {
            var job, options, task;
            if (typeof args[0] === "function") {
              [task, ...args] = args;
              options = {};
            } else {
              [options, task, ...args] = args;
            }
            job = new Job$1(task, args, options, this.jobDefaults, this.rejectOnDrop, this.Events, this._states, this.Promise);
            this._receive(job);
            return job.promise;
          }
          wrap(fn) {
            var schedule, wrapped;
            schedule = this.schedule.bind(this);
            wrapped = function(...args) {
              return schedule(fn.bind(this), ...args);
            };
            wrapped.withOptions = function(options, ...args) {
              return schedule(options, fn, ...args);
            };
            return wrapped;
          }
          async updateSettings(options = {}) {
            await this._store.__updateSettings__(parser$5.overwrite(options, this.storeDefaults));
            parser$5.overwrite(options, this.instanceDefaults, this);
            return this;
          }
          currentReservoir() {
            return this._store.__currentReservoir__();
          }
          incrementReservoir(incr = 0) {
            return this._store.__incrementReservoir__(incr);
          }
        }
        Bottleneck3.default = Bottleneck3;
        Bottleneck3.Events = Events$4;
        Bottleneck3.version = Bottleneck3.prototype.version = require$$8.version;
        Bottleneck3.strategy = Bottleneck3.prototype.strategy = {
          LEAK: 1,
          OVERFLOW: 2,
          OVERFLOW_PRIORITY: 4,
          BLOCK: 3
        };
        Bottleneck3.BottleneckError = Bottleneck3.prototype.BottleneckError = BottleneckError_1;
        Bottleneck3.Group = Bottleneck3.prototype.Group = Group_1;
        Bottleneck3.RedisConnection = Bottleneck3.prototype.RedisConnection = require$$2;
        Bottleneck3.IORedisConnection = Bottleneck3.prototype.IORedisConnection = require$$3;
        Bottleneck3.Batcher = Bottleneck3.prototype.Batcher = Batcher_1;
        Bottleneck3.prototype.jobDefaults = {
          priority: DEFAULT_PRIORITY$1,
          weight: 1,
          expiration: null,
          id: "<no-id>"
        };
        Bottleneck3.prototype.storeDefaults = {
          maxConcurrent: null,
          minTime: 0,
          highWater: null,
          strategy: Bottleneck3.prototype.strategy.LEAK,
          penalty: null,
          reservoir: null,
          reservoirRefreshInterval: null,
          reservoirRefreshAmount: null,
          reservoirIncreaseInterval: null,
          reservoirIncreaseAmount: null,
          reservoirIncreaseMaximum: null
        };
        Bottleneck3.prototype.localStoreDefaults = {
          Promise,
          timeout: null,
          heartbeatInterval: 250
        };
        Bottleneck3.prototype.redisStoreDefaults = {
          Promise,
          timeout: null,
          heartbeatInterval: 5e3,
          clientTimeout: 1e4,
          Redis: null,
          clientOptions: {},
          clusterNodes: null,
          clearDatastore: false,
          connection: null
        };
        Bottleneck3.prototype.instanceDefaults = {
          datastore: "local",
          connection: null,
          id: "<no-id>",
          rejectOnDrop: true,
          trackDoneStatus: false,
          Promise
        };
        Bottleneck3.prototype.stopDefaults = {
          enqueueErrorMessage: "This limiter has been stopped and cannot accept new jobs.",
          dropWaitingJobs: true,
          dropErrorMessage: "This limiter has been stopped."
        };
        return Bottleneck3;
      }).call(commonjsGlobal);
      var Bottleneck_1 = Bottleneck2;
      var lib = Bottleneck_1;
      return lib;
    }));
  }
});

// scripts/index.ts
init_esm_shims();

// scripts/github/index.ts
init_esm_shims();

// scripts/github/auth.ts
init_esm_shims();
import { execFileSync } from "child_process";
var GITHUB_SCOPES = ["repo", "workflow", "delete_repo"];
async function resolveGitHubToken(scopes = GITHUB_SCOPES) {
  const fromEnv = process.env.GITHUB_TOKEN?.trim();
  if (fromEnv) return fromEnv;
  const fromVsCode = await tryVsCodeSession({ scopes });
  if (fromVsCode) return fromVsCode;
  const fromGh = tryGhAuthToken();
  if (fromGh) return fromGh;
  throw new Error(
    "No GitHub auth available. Set GITHUB_TOKEN, sign in to GitHub in VS Code, or run `gh auth login`."
  );
}
async function tryVsCodeSession(opts = {}) {
  const scopes = opts.scopes ?? GITHUB_SCOPES;
  try {
    const vscode = await import("vscode");
    if (!vscode?.authentication?.getSession) return void 0;
    const session = await vscode.authentication.getSession("github", [...scopes], {
      createIfNone: !!opts.createIfNone
    });
    return session?.accessToken;
  } catch {
    return void 0;
  }
}
function tryGhAuthToken() {
  try {
    const raw = execFileSync("gh", ["auth", "token"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      timeout: 5e3
    });
    const token = raw.trim();
    return token || void 0;
  } catch {
    return void 0;
  }
}
async function diagnoseGitHubAuth() {
  const envSet = !!process.env.GITHUB_TOKEN?.trim();
  const vscodeAvailable = await tryVsCodeSession().then(Boolean).catch(() => false);
  const ghAvailable = !!tryGhAuthToken();
  const sources = [];
  if (envSet) sources.push("env");
  if (vscodeAvailable) sources.push("vscode");
  if (ghAvailable) sources.push("gh");
  return {
    sources,
    primary: sources[0],
    scopes: [...GITHUB_SCOPES]
  };
}

// scripts/github/repo.ts
init_esm_shims();

// node_modules/octokit/dist-bundle/index.js
init_esm_shims();

// node_modules/@octokit/core/dist-src/index.js
init_esm_shims();

// node_modules/universal-user-agent/index.js
init_esm_shims();
function getUserAgent() {
  if (typeof navigator === "object" && "userAgent" in navigator) {
    return navigator.userAgent;
  }
  if (typeof process === "object" && process.version !== void 0) {
    return `Node.js/${process.version.substr(1)} (${process.platform}; ${process.arch})`;
  }
  return "<environment undetectable>";
}

// node_modules/before-after-hook/index.js
init_esm_shims();

// node_modules/before-after-hook/lib/register.js
init_esm_shims();
function register(state, name, method, options) {
  if (typeof method !== "function") {
    throw new Error("method for before hook must be a function");
  }
  if (!options) {
    options = {};
  }
  if (Array.isArray(name)) {
    return name.reverse().reduce((callback, name2) => {
      return register.bind(null, state, name2, callback, options);
    }, method)();
  }
  return Promise.resolve().then(() => {
    if (!state.registry[name]) {
      return method(options);
    }
    return state.registry[name].reduce((method2, registered) => {
      return registered.hook.bind(null, method2, options);
    }, method)();
  });
}

// node_modules/before-after-hook/lib/add.js
init_esm_shims();
function addHook(state, kind, name, hook7) {
  const orig = hook7;
  if (!state.registry[name]) {
    state.registry[name] = [];
  }
  if (kind === "before") {
    hook7 = (method, options) => {
      return Promise.resolve().then(orig.bind(null, options)).then(method.bind(null, options));
    };
  }
  if (kind === "after") {
    hook7 = (method, options) => {
      let result;
      return Promise.resolve().then(method.bind(null, options)).then((result_) => {
        result = result_;
        return orig(result, options);
      }).then(() => {
        return result;
      });
    };
  }
  if (kind === "error") {
    hook7 = (method, options) => {
      return Promise.resolve().then(method.bind(null, options)).catch((error) => {
        return orig(error, options);
      });
    };
  }
  state.registry[name].push({
    hook: hook7,
    orig
  });
}

// node_modules/before-after-hook/lib/remove.js
init_esm_shims();
function removeHook(state, name, method) {
  if (!state.registry[name]) {
    return;
  }
  const index = state.registry[name].map((registered) => {
    return registered.orig;
  }).indexOf(method);
  if (index === -1) {
    return;
  }
  state.registry[name].splice(index, 1);
}

// node_modules/before-after-hook/index.js
var bind = Function.bind;
var bindable = bind.bind(bind);
function bindApi(hook7, state, name) {
  const removeHookRef = bindable(removeHook, null).apply(
    null,
    name ? [state, name] : [state]
  );
  hook7.api = { remove: removeHookRef };
  hook7.remove = removeHookRef;
  ["before", "error", "after", "wrap"].forEach((kind) => {
    const args = name ? [state, kind, name] : [state, kind];
    hook7[kind] = hook7.api[kind] = bindable(addHook, null).apply(null, args);
  });
}
function Singular() {
  const singularHookName = /* @__PURE__ */ Symbol("Singular");
  const singularHookState = {
    registry: {}
  };
  const singularHook = register.bind(null, singularHookState, singularHookName);
  bindApi(singularHook, singularHookState, singularHookName);
  return singularHook;
}
function Collection() {
  const state = {
    registry: {}
  };
  const hook7 = register.bind(null, state);
  bindApi(hook7, state);
  return hook7;
}
var before_after_hook_default = { Singular, Collection };

// node_modules/@octokit/request/dist-bundle/index.js
init_esm_shims();

// node_modules/@octokit/endpoint/dist-bundle/index.js
init_esm_shims();
var VERSION = "0.0.0-development";
var userAgent = `octokit-endpoint.js/${VERSION} ${getUserAgent()}`;
var DEFAULTS = {
  method: "GET",
  baseUrl: "https://api.github.com",
  headers: {
    accept: "application/vnd.github.v3+json",
    "user-agent": userAgent
  },
  mediaType: {
    format: ""
  }
};
function lowercaseKeys(object) {
  if (!object) {
    return {};
  }
  return Object.keys(object).reduce((newObj, key) => {
    newObj[key.toLowerCase()] = object[key];
    return newObj;
  }, {});
}
function isPlainObject(value) {
  if (typeof value !== "object" || value === null) return false;
  if (Object.prototype.toString.call(value) !== "[object Object]") return false;
  const proto = Object.getPrototypeOf(value);
  if (proto === null) return true;
  const Ctor = Object.prototype.hasOwnProperty.call(proto, "constructor") && proto.constructor;
  return typeof Ctor === "function" && Ctor instanceof Ctor && Function.prototype.call(Ctor) === Function.prototype.call(value);
}
function mergeDeep(defaults, options) {
  const result = Object.assign({}, defaults);
  Object.keys(options).forEach((key) => {
    if (isPlainObject(options[key])) {
      if (!(key in defaults)) Object.assign(result, { [key]: options[key] });
      else result[key] = mergeDeep(defaults[key], options[key]);
    } else {
      Object.assign(result, { [key]: options[key] });
    }
  });
  return result;
}
function removeUndefinedProperties(obj) {
  for (const key in obj) {
    if (obj[key] === void 0) {
      delete obj[key];
    }
  }
  return obj;
}
function merge(defaults, route, options) {
  if (typeof route === "string") {
    let [method, url] = route.split(" ");
    options = Object.assign(url ? { method, url } : { url: method }, options);
  } else {
    options = Object.assign({}, route);
  }
  options.headers = lowercaseKeys(options.headers);
  removeUndefinedProperties(options);
  removeUndefinedProperties(options.headers);
  const mergedOptions = mergeDeep(defaults || {}, options);
  if (options.url === "/graphql") {
    if (defaults && defaults.mediaType.previews?.length) {
      mergedOptions.mediaType.previews = defaults.mediaType.previews.filter(
        (preview) => !mergedOptions.mediaType.previews.includes(preview)
      ).concat(mergedOptions.mediaType.previews);
    }
    mergedOptions.mediaType.previews = (mergedOptions.mediaType.previews || []).map((preview) => preview.replace(/-preview/, ""));
  }
  return mergedOptions;
}
function addQueryParameters(url, parameters) {
  const separator = /\?/.test(url) ? "&" : "?";
  const names = Object.keys(parameters);
  if (names.length === 0) {
    return url;
  }
  return url + separator + names.map((name) => {
    if (name === "q") {
      return "q=" + parameters.q.split("+").map(encodeURIComponent).join("+");
    }
    return `${name}=${encodeURIComponent(parameters[name])}`;
  }).join("&");
}
var urlVariableRegex = /\{[^{}}]+\}/g;
function removeNonChars(variableName) {
  return variableName.replace(/(?:^\W+)|(?:(?<!\W)\W+$)/g, "").split(/,/);
}
function extractUrlVariableNames(url) {
  const matches = url.match(urlVariableRegex);
  if (!matches) {
    return [];
  }
  return matches.map(removeNonChars).reduce((a, b) => a.concat(b), []);
}
function omit(object, keysToOmit) {
  const result = { __proto__: null };
  for (const key of Object.keys(object)) {
    if (keysToOmit.indexOf(key) === -1) {
      result[key] = object[key];
    }
  }
  return result;
}
function encodeReserved(str) {
  return str.split(/(%[0-9A-Fa-f]{2})/g).map(function(part) {
    if (!/%[0-9A-Fa-f]/.test(part)) {
      part = encodeURI(part).replace(/%5B/g, "[").replace(/%5D/g, "]");
    }
    return part;
  }).join("");
}
function encodeUnreserved(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
    return "%" + c.charCodeAt(0).toString(16).toUpperCase();
  });
}
function encodeValue(operator, value, key) {
  value = operator === "+" || operator === "#" ? encodeReserved(value) : encodeUnreserved(value);
  if (key) {
    return encodeUnreserved(key) + "=" + value;
  } else {
    return value;
  }
}
function isDefined(value) {
  return value !== void 0 && value !== null;
}
function isKeyOperator(operator) {
  return operator === ";" || operator === "&" || operator === "?";
}
function getValues(context, operator, key, modifier) {
  var value = context[key], result = [];
  if (isDefined(value) && value !== "") {
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      value = value.toString();
      if (modifier && modifier !== "*") {
        value = value.substring(0, parseInt(modifier, 10));
      }
      result.push(
        encodeValue(operator, value, isKeyOperator(operator) ? key : "")
      );
    } else {
      if (modifier === "*") {
        if (Array.isArray(value)) {
          value.filter(isDefined).forEach(function(value2) {
            result.push(
              encodeValue(operator, value2, isKeyOperator(operator) ? key : "")
            );
          });
        } else {
          Object.keys(value).forEach(function(k) {
            if (isDefined(value[k])) {
              result.push(encodeValue(operator, value[k], k));
            }
          });
        }
      } else {
        const tmp = [];
        if (Array.isArray(value)) {
          value.filter(isDefined).forEach(function(value2) {
            tmp.push(encodeValue(operator, value2));
          });
        } else {
          Object.keys(value).forEach(function(k) {
            if (isDefined(value[k])) {
              tmp.push(encodeUnreserved(k));
              tmp.push(encodeValue(operator, value[k].toString()));
            }
          });
        }
        if (isKeyOperator(operator)) {
          result.push(encodeUnreserved(key) + "=" + tmp.join(","));
        } else if (tmp.length !== 0) {
          result.push(tmp.join(","));
        }
      }
    }
  } else {
    if (operator === ";") {
      if (isDefined(value)) {
        result.push(encodeUnreserved(key));
      }
    } else if (value === "" && (operator === "&" || operator === "?")) {
      result.push(encodeUnreserved(key) + "=");
    } else if (value === "") {
      result.push("");
    }
  }
  return result;
}
function parseUrl(template) {
  return {
    expand: expand.bind(null, template)
  };
}
function expand(template, context) {
  var operators = ["+", "#", ".", "/", ";", "?", "&"];
  template = template.replace(
    /\{([^\{\}]+)\}|([^\{\}]+)/g,
    function(_, expression, literal) {
      if (expression) {
        let operator = "";
        const values = [];
        if (operators.indexOf(expression.charAt(0)) !== -1) {
          operator = expression.charAt(0);
          expression = expression.substr(1);
        }
        expression.split(/,/g).forEach(function(variable) {
          var tmp = /([^:\*]*)(?::(\d+)|(\*))?/.exec(variable);
          values.push(getValues(context, operator, tmp[1], tmp[2] || tmp[3]));
        });
        if (operator && operator !== "+") {
          var separator = ",";
          if (operator === "?") {
            separator = "&";
          } else if (operator !== "#") {
            separator = operator;
          }
          return (values.length !== 0 ? operator : "") + values.join(separator);
        } else {
          return values.join(",");
        }
      } else {
        return encodeReserved(literal);
      }
    }
  );
  if (template === "/") {
    return template;
  } else {
    return template.replace(/\/$/, "");
  }
}
function parse(options) {
  let method = options.method.toUpperCase();
  let url = (options.url || "/").replace(/:([a-z]\w+)/g, "{$1}");
  let headers = Object.assign({}, options.headers);
  let body;
  let parameters = omit(options, [
    "method",
    "baseUrl",
    "url",
    "headers",
    "request",
    "mediaType"
  ]);
  const urlVariableNames = extractUrlVariableNames(url);
  url = parseUrl(url).expand(parameters);
  if (!/^http/.test(url)) {
    url = options.baseUrl + url;
  }
  const omittedParameters = Object.keys(options).filter((option) => urlVariableNames.includes(option)).concat("baseUrl");
  const remainingParameters = omit(parameters, omittedParameters);
  const isBinaryRequest = /application\/octet-stream/i.test(headers.accept);
  if (!isBinaryRequest) {
    if (options.mediaType.format) {
      headers.accept = headers.accept.split(/,/).map(
        (format) => format.replace(
          /application\/vnd(\.\w+)(\.v3)?(\.\w+)?(\+json)?$/,
          `application/vnd$1$2.${options.mediaType.format}`
        )
      ).join(",");
    }
    if (url.endsWith("/graphql")) {
      if (options.mediaType.previews?.length) {
        const previewsFromAcceptHeader = headers.accept.match(/(?<![\w-])[\w-]+(?=-preview)/g) || [];
        headers.accept = previewsFromAcceptHeader.concat(options.mediaType.previews).map((preview) => {
          const format = options.mediaType.format ? `.${options.mediaType.format}` : "+json";
          return `application/vnd.github.${preview}-preview${format}`;
        }).join(",");
      }
    }
  }
  if (["GET", "HEAD"].includes(method)) {
    url = addQueryParameters(url, remainingParameters);
  } else {
    if ("data" in remainingParameters) {
      body = remainingParameters.data;
    } else {
      if (Object.keys(remainingParameters).length) {
        body = remainingParameters;
      }
    }
  }
  if (!headers["content-type"] && typeof body !== "undefined") {
    headers["content-type"] = "application/json; charset=utf-8";
  }
  if (["PATCH", "PUT"].includes(method) && typeof body === "undefined") {
    body = "";
  }
  return Object.assign(
    { method, url, headers },
    typeof body !== "undefined" ? { body } : null,
    options.request ? { request: options.request } : null
  );
}
function endpointWithDefaults(defaults, route, options) {
  return parse(merge(defaults, route, options));
}
function withDefaults(oldDefaults, newDefaults) {
  const DEFAULTS2 = merge(oldDefaults, newDefaults);
  const endpoint2 = endpointWithDefaults.bind(null, DEFAULTS2);
  return Object.assign(endpoint2, {
    DEFAULTS: DEFAULTS2,
    defaults: withDefaults.bind(null, DEFAULTS2),
    merge: merge.bind(null, DEFAULTS2),
    parse
  });
}
var endpoint = withDefaults(null, DEFAULTS);

// node_modules/@octokit/request/dist-bundle/index.js
var import_fast_content_type_parse = __toESM(require_fast_content_type_parse(), 1);

// node_modules/@octokit/request-error/dist-src/index.js
init_esm_shims();
var RequestError = class extends Error {
  name;
  /**
   * http status code
   */
  status;
  /**
   * Request options that lead to the error.
   */
  request;
  /**
   * Response object if a response was received
   */
  response;
  constructor(message, statusCode, options) {
    super(message);
    this.name = "HttpError";
    this.status = Number.parseInt(statusCode);
    if (Number.isNaN(this.status)) {
      this.status = 0;
    }
    if ("response" in options) {
      this.response = options.response;
    }
    const requestCopy = Object.assign({}, options.request);
    if (options.request.headers.authorization) {
      requestCopy.headers = Object.assign({}, options.request.headers, {
        authorization: options.request.headers.authorization.replace(
          /(?<! ) .*$/,
          " [REDACTED]"
        )
      });
    }
    requestCopy.url = requestCopy.url.replace(/\bclient_secret=\w+/g, "client_secret=[REDACTED]").replace(/\baccess_token=\w+/g, "access_token=[REDACTED]");
    this.request = requestCopy;
  }
};

// node_modules/@octokit/request/dist-bundle/index.js
var VERSION2 = "9.2.4";
var defaults_default = {
  headers: {
    "user-agent": `octokit-request.js/${VERSION2} ${getUserAgent()}`
  }
};
function isPlainObject2(value) {
  if (typeof value !== "object" || value === null) return false;
  if (Object.prototype.toString.call(value) !== "[object Object]") return false;
  const proto = Object.getPrototypeOf(value);
  if (proto === null) return true;
  const Ctor = Object.prototype.hasOwnProperty.call(proto, "constructor") && proto.constructor;
  return typeof Ctor === "function" && Ctor instanceof Ctor && Function.prototype.call(Ctor) === Function.prototype.call(value);
}
async function fetchWrapper(requestOptions) {
  const fetch3 = requestOptions.request?.fetch || globalThis.fetch;
  if (!fetch3) {
    throw new Error(
      "fetch is not set. Please pass a fetch implementation as new Octokit({ request: { fetch }}). Learn more at https://github.com/octokit/octokit.js/#fetch-missing"
    );
  }
  const log = requestOptions.request?.log || console;
  const parseSuccessResponseBody = requestOptions.request?.parseSuccessResponseBody !== false;
  const body = isPlainObject2(requestOptions.body) || Array.isArray(requestOptions.body) ? JSON.stringify(requestOptions.body) : requestOptions.body;
  const requestHeaders = Object.fromEntries(
    Object.entries(requestOptions.headers).map(([name, value]) => [
      name,
      String(value)
    ])
  );
  let fetchResponse;
  try {
    fetchResponse = await fetch3(requestOptions.url, {
      method: requestOptions.method,
      body,
      redirect: requestOptions.request?.redirect,
      headers: requestHeaders,
      signal: requestOptions.request?.signal,
      // duplex must be set if request.body is ReadableStream or Async Iterables.
      // See https://fetch.spec.whatwg.org/#dom-requestinit-duplex.
      ...requestOptions.body && { duplex: "half" }
    });
  } catch (error) {
    let message = "Unknown Error";
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        error.status = 500;
        throw error;
      }
      message = error.message;
      if (error.name === "TypeError" && "cause" in error) {
        if (error.cause instanceof Error) {
          message = error.cause.message;
        } else if (typeof error.cause === "string") {
          message = error.cause;
        }
      }
    }
    const requestError = new RequestError(message, 500, {
      request: requestOptions
    });
    requestError.cause = error;
    throw requestError;
  }
  const status = fetchResponse.status;
  const url = fetchResponse.url;
  const responseHeaders = {};
  for (const [key, value] of fetchResponse.headers) {
    responseHeaders[key] = value;
  }
  const octokitResponse = {
    url,
    status,
    headers: responseHeaders,
    data: ""
  };
  if ("deprecation" in responseHeaders) {
    const matches = responseHeaders.link && responseHeaders.link.match(/<([^<>]+)>; rel="deprecation"/);
    const deprecationLink = matches && matches.pop();
    log.warn(
      `[@octokit/request] "${requestOptions.method} ${requestOptions.url}" is deprecated. It is scheduled to be removed on ${responseHeaders.sunset}${deprecationLink ? `. See ${deprecationLink}` : ""}`
    );
  }
  if (status === 204 || status === 205) {
    return octokitResponse;
  }
  if (requestOptions.method === "HEAD") {
    if (status < 400) {
      return octokitResponse;
    }
    throw new RequestError(fetchResponse.statusText, status, {
      response: octokitResponse,
      request: requestOptions
    });
  }
  if (status === 304) {
    octokitResponse.data = await getResponseData(fetchResponse);
    throw new RequestError("Not modified", status, {
      response: octokitResponse,
      request: requestOptions
    });
  }
  if (status >= 400) {
    octokitResponse.data = await getResponseData(fetchResponse);
    throw new RequestError(toErrorMessage(octokitResponse.data), status, {
      response: octokitResponse,
      request: requestOptions
    });
  }
  octokitResponse.data = parseSuccessResponseBody ? await getResponseData(fetchResponse) : fetchResponse.body;
  return octokitResponse;
}
async function getResponseData(response) {
  const contentType = response.headers.get("content-type");
  if (!contentType) {
    return response.text().catch(() => "");
  }
  const mimetype = (0, import_fast_content_type_parse.safeParse)(contentType);
  if (isJSONResponse(mimetype)) {
    let text = "";
    try {
      text = await response.text();
      return JSON.parse(text);
    } catch (err) {
      return text;
    }
  } else if (mimetype.type.startsWith("text/") || mimetype.parameters.charset?.toLowerCase() === "utf-8") {
    return response.text().catch(() => "");
  } else {
    return response.arrayBuffer().catch(() => new ArrayBuffer(0));
  }
}
function isJSONResponse(mimetype) {
  return mimetype.type === "application/json" || mimetype.type === "application/scim+json";
}
function toErrorMessage(data) {
  if (typeof data === "string") {
    return data;
  }
  if (data instanceof ArrayBuffer) {
    return "Unknown error";
  }
  if ("message" in data) {
    const suffix = "documentation_url" in data ? ` - ${data.documentation_url}` : "";
    return Array.isArray(data.errors) ? `${data.message}: ${data.errors.map((v) => JSON.stringify(v)).join(", ")}${suffix}` : `${data.message}${suffix}`;
  }
  return `Unknown error: ${JSON.stringify(data)}`;
}
function withDefaults2(oldEndpoint, newDefaults) {
  const endpoint2 = oldEndpoint.defaults(newDefaults);
  const newApi = function(route, parameters) {
    const endpointOptions = endpoint2.merge(route, parameters);
    if (!endpointOptions.request || !endpointOptions.request.hook) {
      return fetchWrapper(endpoint2.parse(endpointOptions));
    }
    const request2 = (route2, parameters2) => {
      return fetchWrapper(
        endpoint2.parse(endpoint2.merge(route2, parameters2))
      );
    };
    Object.assign(request2, {
      endpoint: endpoint2,
      defaults: withDefaults2.bind(null, endpoint2)
    });
    return endpointOptions.request.hook(request2, endpointOptions);
  };
  return Object.assign(newApi, {
    endpoint: endpoint2,
    defaults: withDefaults2.bind(null, endpoint2)
  });
}
var request = withDefaults2(endpoint, defaults_default);

// node_modules/@octokit/graphql/dist-bundle/index.js
init_esm_shims();
var VERSION3 = "0.0.0-development";
function _buildMessageForResponseErrors(data) {
  return `Request failed due to following response errors:
` + data.errors.map((e) => ` - ${e.message}`).join("\n");
}
var GraphqlResponseError = class extends Error {
  constructor(request2, headers, response) {
    super(_buildMessageForResponseErrors(response));
    this.request = request2;
    this.headers = headers;
    this.response = response;
    this.errors = response.errors;
    this.data = response.data;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
  name = "GraphqlResponseError";
  errors;
  data;
};
var NON_VARIABLE_OPTIONS = [
  "method",
  "baseUrl",
  "url",
  "headers",
  "request",
  "query",
  "mediaType",
  "operationName"
];
var FORBIDDEN_VARIABLE_OPTIONS = ["query", "method", "url"];
var GHES_V3_SUFFIX_REGEX = /\/api\/v3\/?$/;
function graphql(request2, query, options) {
  if (options) {
    if (typeof query === "string" && "query" in options) {
      return Promise.reject(
        new Error(`[@octokit/graphql] "query" cannot be used as variable name`)
      );
    }
    for (const key in options) {
      if (!FORBIDDEN_VARIABLE_OPTIONS.includes(key)) continue;
      return Promise.reject(
        new Error(
          `[@octokit/graphql] "${key}" cannot be used as variable name`
        )
      );
    }
  }
  const parsedOptions = typeof query === "string" ? Object.assign({ query }, options) : query;
  const requestOptions = Object.keys(
    parsedOptions
  ).reduce((result, key) => {
    if (NON_VARIABLE_OPTIONS.includes(key)) {
      result[key] = parsedOptions[key];
      return result;
    }
    if (!result.variables) {
      result.variables = {};
    }
    result.variables[key] = parsedOptions[key];
    return result;
  }, {});
  const baseUrl = parsedOptions.baseUrl || request2.endpoint.DEFAULTS.baseUrl;
  if (GHES_V3_SUFFIX_REGEX.test(baseUrl)) {
    requestOptions.url = baseUrl.replace(GHES_V3_SUFFIX_REGEX, "/api/graphql");
  }
  return request2(requestOptions).then((response) => {
    if (response.data.errors) {
      const headers = {};
      for (const key of Object.keys(response.headers)) {
        headers[key] = response.headers[key];
      }
      throw new GraphqlResponseError(
        requestOptions,
        headers,
        response.data
      );
    }
    return response.data.data;
  });
}
function withDefaults3(request2, newDefaults) {
  const newRequest = request2.defaults(newDefaults);
  const newApi = (query, options) => {
    return graphql(newRequest, query, options);
  };
  return Object.assign(newApi, {
    defaults: withDefaults3.bind(null, newRequest),
    endpoint: newRequest.endpoint
  });
}
var graphql2 = withDefaults3(request, {
  headers: {
    "user-agent": `octokit-graphql.js/${VERSION3} ${getUserAgent()}`
  },
  method: "POST",
  url: "/graphql"
});
function withCustomRequest(customRequest) {
  return withDefaults3(customRequest, {
    method: "POST",
    url: "/graphql"
  });
}

// node_modules/@octokit/auth-token/dist-bundle/index.js
init_esm_shims();
var b64url = "(?:[a-zA-Z0-9_-]+)";
var sep = "\\.";
var jwtRE = new RegExp(`^${b64url}${sep}${b64url}${sep}${b64url}$`);
var isJWT = jwtRE.test.bind(jwtRE);
async function auth(token) {
  const isApp = isJWT(token);
  const isInstallation = token.startsWith("v1.") || token.startsWith("ghs_");
  const isUserToServer = token.startsWith("ghu_");
  const tokenType = isApp ? "app" : isInstallation ? "installation" : isUserToServer ? "user-to-server" : "oauth";
  return {
    type: "token",
    token,
    tokenType
  };
}
function withAuthorizationPrefix(token) {
  if (token.split(/\./).length === 3) {
    return `bearer ${token}`;
  }
  return `token ${token}`;
}
async function hook(token, request2, route, parameters) {
  const endpoint2 = request2.endpoint.merge(
    route,
    parameters
  );
  endpoint2.headers.authorization = withAuthorizationPrefix(token);
  return request2(endpoint2);
}
var createTokenAuth = function createTokenAuth2(token) {
  if (!token) {
    throw new Error("[@octokit/auth-token] No token passed to createTokenAuth");
  }
  if (typeof token !== "string") {
    throw new Error(
      "[@octokit/auth-token] Token passed to createTokenAuth is not a string"
    );
  }
  token = token.replace(/^(token|bearer) +/i, "");
  return Object.assign(auth.bind(null, token), {
    hook: hook.bind(null, token)
  });
};

// node_modules/@octokit/core/dist-src/version.js
init_esm_shims();
var VERSION4 = "6.1.6";

// node_modules/@octokit/core/dist-src/index.js
var noop = () => {
};
var consoleWarn = console.warn.bind(console);
var consoleError = console.error.bind(console);
function createLogger(logger = {}) {
  if (typeof logger.debug !== "function") {
    logger.debug = noop;
  }
  if (typeof logger.info !== "function") {
    logger.info = noop;
  }
  if (typeof logger.warn !== "function") {
    logger.warn = consoleWarn;
  }
  if (typeof logger.error !== "function") {
    logger.error = consoleError;
  }
  return logger;
}
var userAgentTrail = `octokit-core.js/${VERSION4} ${getUserAgent()}`;
var Octokit = class {
  static VERSION = VERSION4;
  static defaults(defaults) {
    const OctokitWithDefaults = class extends this {
      constructor(...args) {
        const options = args[0] || {};
        if (typeof defaults === "function") {
          super(defaults(options));
          return;
        }
        super(
          Object.assign(
            {},
            defaults,
            options,
            options.userAgent && defaults.userAgent ? {
              userAgent: `${options.userAgent} ${defaults.userAgent}`
            } : null
          )
        );
      }
    };
    return OctokitWithDefaults;
  }
  static plugins = [];
  /**
   * Attach a plugin (or many) to your Octokit instance.
   *
   * @example
   * const API = Octokit.plugin(plugin1, plugin2, plugin3, ...)
   */
  static plugin(...newPlugins) {
    const currentPlugins = this.plugins;
    const NewOctokit = class extends this {
      static plugins = currentPlugins.concat(
        newPlugins.filter((plugin) => !currentPlugins.includes(plugin))
      );
    };
    return NewOctokit;
  }
  constructor(options = {}) {
    const hook7 = new before_after_hook_default.Collection();
    const requestDefaults = {
      baseUrl: request.endpoint.DEFAULTS.baseUrl,
      headers: {},
      request: Object.assign({}, options.request, {
        // @ts-ignore internal usage only, no need to type
        hook: hook7.bind(null, "request")
      }),
      mediaType: {
        previews: [],
        format: ""
      }
    };
    requestDefaults.headers["user-agent"] = options.userAgent ? `${options.userAgent} ${userAgentTrail}` : userAgentTrail;
    if (options.baseUrl) {
      requestDefaults.baseUrl = options.baseUrl;
    }
    if (options.previews) {
      requestDefaults.mediaType.previews = options.previews;
    }
    if (options.timeZone) {
      requestDefaults.headers["time-zone"] = options.timeZone;
    }
    this.request = request.defaults(requestDefaults);
    this.graphql = withCustomRequest(this.request).defaults(requestDefaults);
    this.log = createLogger(options.log);
    this.hook = hook7;
    if (!options.authStrategy) {
      if (!options.auth) {
        this.auth = async () => ({
          type: "unauthenticated"
        });
      } else {
        const auth7 = createTokenAuth(options.auth);
        hook7.wrap("request", auth7.hook);
        this.auth = auth7;
      }
    } else {
      const { authStrategy, ...otherOptions } = options;
      const auth7 = authStrategy(
        Object.assign(
          {
            request: this.request,
            log: this.log,
            // we pass the current octokit instance as well as its constructor options
            // to allow for authentication strategies that return a new octokit instance
            // that shares the same internal state as the current one. The original
            // requirement for this was the "event-octokit" authentication strategy
            // of https://github.com/probot/octokit-auth-probot.
            octokit: this,
            octokitOptions: otherOptions
          },
          options.auth
        )
      );
      hook7.wrap("request", auth7.hook);
      this.auth = auth7;
    }
    const classConstructor = this.constructor;
    for (let i = 0; i < classConstructor.plugins.length; ++i) {
      Object.assign(this, classConstructor.plugins[i](this, options));
    }
  }
  // assigned during constructor
  request;
  graphql;
  log;
  hook;
  // TODO: type `octokit.auth` based on passed options.authStrategy
  auth;
};

// node_modules/@octokit/plugin-paginate-rest/dist-bundle/index.js
init_esm_shims();
var VERSION5 = "0.0.0-development";
function normalizePaginatedListResponse(response) {
  if (!response.data) {
    return {
      ...response,
      data: []
    };
  }
  const responseNeedsNormalization = "total_count" in response.data && !("url" in response.data);
  if (!responseNeedsNormalization) return response;
  const incompleteResults = response.data.incomplete_results;
  const repositorySelection = response.data.repository_selection;
  const totalCount = response.data.total_count;
  delete response.data.incomplete_results;
  delete response.data.repository_selection;
  delete response.data.total_count;
  const namespaceKey = Object.keys(response.data)[0];
  const data = response.data[namespaceKey];
  response.data = data;
  if (typeof incompleteResults !== "undefined") {
    response.data.incomplete_results = incompleteResults;
  }
  if (typeof repositorySelection !== "undefined") {
    response.data.repository_selection = repositorySelection;
  }
  response.data.total_count = totalCount;
  return response;
}
function iterator(octokit2, route, parameters) {
  const options = typeof route === "function" ? route.endpoint(parameters) : octokit2.request.endpoint(route, parameters);
  const requestMethod = typeof route === "function" ? route : octokit2.request;
  const method = options.method;
  const headers = options.headers;
  let url = options.url;
  return {
    [Symbol.asyncIterator]: () => ({
      async next() {
        if (!url) return { done: true };
        try {
          const response = await requestMethod({ method, url, headers });
          const normalizedResponse = normalizePaginatedListResponse(response);
          url = ((normalizedResponse.headers.link || "").match(
            /<([^<>]+)>;\s*rel="next"/
          ) || [])[1];
          return { value: normalizedResponse };
        } catch (error) {
          if (error.status !== 409) throw error;
          url = "";
          return {
            value: {
              status: 200,
              headers: {},
              data: []
            }
          };
        }
      }
    })
  };
}
function paginate(octokit2, route, parameters, mapFn) {
  if (typeof parameters === "function") {
    mapFn = parameters;
    parameters = void 0;
  }
  return gather(
    octokit2,
    [],
    iterator(octokit2, route, parameters)[Symbol.asyncIterator](),
    mapFn
  );
}
function gather(octokit2, results, iterator2, mapFn) {
  return iterator2.next().then((result) => {
    if (result.done) {
      return results;
    }
    let earlyExit = false;
    function done() {
      earlyExit = true;
    }
    results = results.concat(
      mapFn ? mapFn(result.value, done) : result.value.data
    );
    if (earlyExit) {
      return results;
    }
    return gather(octokit2, results, iterator2, mapFn);
  });
}
var composePaginateRest = Object.assign(paginate, {
  iterator
});
function paginateRest(octokit2) {
  return {
    paginate: Object.assign(paginate.bind(null, octokit2), {
      iterator: iterator.bind(null, octokit2)
    })
  };
}
paginateRest.VERSION = VERSION5;

// node_modules/@octokit/plugin-paginate-graphql/dist-bundle/index.js
init_esm_shims();
var generateMessage = (path33, cursorValue) => `The cursor at "${path33.join(
  ","
)}" did not change its value "${cursorValue}" after a page transition. Please make sure your that your query is set up correctly.`;
var MissingCursorChange = class extends Error {
  constructor(pageInfo, cursorValue) {
    super(generateMessage(pageInfo.pathInQuery, cursorValue));
    this.pageInfo = pageInfo;
    this.cursorValue = cursorValue;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
  name = "MissingCursorChangeError";
};
var MissingPageInfo = class extends Error {
  constructor(response) {
    super(
      `No pageInfo property found in response. Please make sure to specify the pageInfo in your query. Response-Data: ${JSON.stringify(
        response,
        null,
        2
      )}`
    );
    this.response = response;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
  name = "MissingPageInfo";
};
var isObject = (value) => Object.prototype.toString.call(value) === "[object Object]";
function findPaginatedResourcePath(responseData) {
  const paginatedResourcePath = deepFindPathToProperty(
    responseData,
    "pageInfo"
  );
  if (paginatedResourcePath.length === 0) {
    throw new MissingPageInfo(responseData);
  }
  return paginatedResourcePath;
}
var deepFindPathToProperty = (object, searchProp, path33 = []) => {
  for (const key of Object.keys(object)) {
    const currentPath = [...path33, key];
    const currentValue = object[key];
    if (isObject(currentValue)) {
      if (currentValue.hasOwnProperty(searchProp)) {
        return currentPath;
      }
      const result = deepFindPathToProperty(
        currentValue,
        searchProp,
        currentPath
      );
      if (result.length > 0) {
        return result;
      }
    }
  }
  return [];
};
var get = (object, path33) => {
  return path33.reduce((current, nextProperty) => current[nextProperty], object);
};
var set = (object, path33, mutator) => {
  const lastProperty = path33[path33.length - 1];
  const parentPath = [...path33].slice(0, -1);
  const parent = get(object, parentPath);
  if (typeof mutator === "function") {
    parent[lastProperty] = mutator(parent[lastProperty]);
  } else {
    parent[lastProperty] = mutator;
  }
};
var extractPageInfos = (responseData) => {
  const pageInfoPath = findPaginatedResourcePath(responseData);
  return {
    pathInQuery: pageInfoPath,
    pageInfo: get(responseData, [...pageInfoPath, "pageInfo"])
  };
};
var isForwardSearch = (givenPageInfo) => {
  return givenPageInfo.hasOwnProperty("hasNextPage");
};
var getCursorFrom = (pageInfo) => isForwardSearch(pageInfo) ? pageInfo.endCursor : pageInfo.startCursor;
var hasAnotherPage = (pageInfo) => isForwardSearch(pageInfo) ? pageInfo.hasNextPage : pageInfo.hasPreviousPage;
var createIterator = (octokit2) => {
  return (query, initialParameters = {}) => {
    let nextPageExists = true;
    let parameters = { ...initialParameters };
    return {
      [Symbol.asyncIterator]: () => ({
        async next() {
          if (!nextPageExists) return { done: true, value: {} };
          const response = await octokit2.graphql(
            query,
            parameters
          );
          const pageInfoContext = extractPageInfos(response);
          const nextCursorValue = getCursorFrom(pageInfoContext.pageInfo);
          nextPageExists = hasAnotherPage(pageInfoContext.pageInfo);
          if (nextPageExists && nextCursorValue === parameters.cursor) {
            throw new MissingCursorChange(pageInfoContext, nextCursorValue);
          }
          parameters = {
            ...parameters,
            cursor: nextCursorValue
          };
          return { done: false, value: response };
        }
      })
    };
  };
};
var mergeResponses = (response1, response2) => {
  if (Object.keys(response1).length === 0) {
    return Object.assign(response1, response2);
  }
  const path33 = findPaginatedResourcePath(response1);
  const nodesPath = [...path33, "nodes"];
  const newNodes = get(response2, nodesPath);
  if (newNodes) {
    set(response1, nodesPath, (values) => {
      return [...values, ...newNodes];
    });
  }
  const edgesPath = [...path33, "edges"];
  const newEdges = get(response2, edgesPath);
  if (newEdges) {
    set(response1, edgesPath, (values) => {
      return [...values, ...newEdges];
    });
  }
  const pageInfoPath = [...path33, "pageInfo"];
  set(response1, pageInfoPath, get(response2, pageInfoPath));
  return response1;
};
var createPaginate = (octokit2) => {
  const iterator2 = createIterator(octokit2);
  return async (query, initialParameters = {}) => {
    let mergedResponse = {};
    for await (const response of iterator2(
      query,
      initialParameters
    )) {
      mergedResponse = mergeResponses(mergedResponse, response);
    }
    return mergedResponse;
  };
};
function paginateGraphQL(octokit2) {
  return {
    graphql: Object.assign(octokit2.graphql, {
      paginate: Object.assign(createPaginate(octokit2), {
        iterator: createIterator(octokit2)
      })
    })
  };
}

// node_modules/@octokit/plugin-rest-endpoint-methods/dist-src/index.js
init_esm_shims();

// node_modules/@octokit/plugin-rest-endpoint-methods/dist-src/version.js
init_esm_shims();
var VERSION6 = "14.0.0";

// node_modules/@octokit/plugin-rest-endpoint-methods/dist-src/endpoints-to-methods.js
init_esm_shims();

// node_modules/@octokit/plugin-rest-endpoint-methods/dist-src/generated/endpoints.js
init_esm_shims();
var Endpoints = {
  actions: {
    addCustomLabelsToSelfHostedRunnerForOrg: [
      "POST /orgs/{org}/actions/runners/{runner_id}/labels"
    ],
    addCustomLabelsToSelfHostedRunnerForRepo: [
      "POST /repos/{owner}/{repo}/actions/runners/{runner_id}/labels"
    ],
    addRepoAccessToSelfHostedRunnerGroupInOrg: [
      "PUT /orgs/{org}/actions/runner-groups/{runner_group_id}/repositories/{repository_id}"
    ],
    addSelectedRepoToOrgSecret: [
      "PUT /orgs/{org}/actions/secrets/{secret_name}/repositories/{repository_id}"
    ],
    addSelectedRepoToOrgVariable: [
      "PUT /orgs/{org}/actions/variables/{name}/repositories/{repository_id}"
    ],
    approveWorkflowRun: [
      "POST /repos/{owner}/{repo}/actions/runs/{run_id}/approve"
    ],
    cancelWorkflowRun: [
      "POST /repos/{owner}/{repo}/actions/runs/{run_id}/cancel"
    ],
    createEnvironmentVariable: [
      "POST /repos/{owner}/{repo}/environments/{environment_name}/variables"
    ],
    createHostedRunnerForOrg: ["POST /orgs/{org}/actions/hosted-runners"],
    createOrUpdateEnvironmentSecret: [
      "PUT /repos/{owner}/{repo}/environments/{environment_name}/secrets/{secret_name}"
    ],
    createOrUpdateOrgSecret: ["PUT /orgs/{org}/actions/secrets/{secret_name}"],
    createOrUpdateRepoSecret: [
      "PUT /repos/{owner}/{repo}/actions/secrets/{secret_name}"
    ],
    createOrgVariable: ["POST /orgs/{org}/actions/variables"],
    createRegistrationTokenForOrg: [
      "POST /orgs/{org}/actions/runners/registration-token"
    ],
    createRegistrationTokenForRepo: [
      "POST /repos/{owner}/{repo}/actions/runners/registration-token"
    ],
    createRemoveTokenForOrg: ["POST /orgs/{org}/actions/runners/remove-token"],
    createRemoveTokenForRepo: [
      "POST /repos/{owner}/{repo}/actions/runners/remove-token"
    ],
    createRepoVariable: ["POST /repos/{owner}/{repo}/actions/variables"],
    createWorkflowDispatch: [
      "POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches"
    ],
    deleteActionsCacheById: [
      "DELETE /repos/{owner}/{repo}/actions/caches/{cache_id}"
    ],
    deleteActionsCacheByKey: [
      "DELETE /repos/{owner}/{repo}/actions/caches{?key,ref}"
    ],
    deleteArtifact: [
      "DELETE /repos/{owner}/{repo}/actions/artifacts/{artifact_id}"
    ],
    deleteEnvironmentSecret: [
      "DELETE /repos/{owner}/{repo}/environments/{environment_name}/secrets/{secret_name}"
    ],
    deleteEnvironmentVariable: [
      "DELETE /repos/{owner}/{repo}/environments/{environment_name}/variables/{name}"
    ],
    deleteHostedRunnerForOrg: [
      "DELETE /orgs/{org}/actions/hosted-runners/{hosted_runner_id}"
    ],
    deleteOrgSecret: ["DELETE /orgs/{org}/actions/secrets/{secret_name}"],
    deleteOrgVariable: ["DELETE /orgs/{org}/actions/variables/{name}"],
    deleteRepoSecret: [
      "DELETE /repos/{owner}/{repo}/actions/secrets/{secret_name}"
    ],
    deleteRepoVariable: [
      "DELETE /repos/{owner}/{repo}/actions/variables/{name}"
    ],
    deleteSelfHostedRunnerFromOrg: [
      "DELETE /orgs/{org}/actions/runners/{runner_id}"
    ],
    deleteSelfHostedRunnerFromRepo: [
      "DELETE /repos/{owner}/{repo}/actions/runners/{runner_id}"
    ],
    deleteWorkflowRun: ["DELETE /repos/{owner}/{repo}/actions/runs/{run_id}"],
    deleteWorkflowRunLogs: [
      "DELETE /repos/{owner}/{repo}/actions/runs/{run_id}/logs"
    ],
    disableSelectedRepositoryGithubActionsOrganization: [
      "DELETE /orgs/{org}/actions/permissions/repositories/{repository_id}"
    ],
    disableWorkflow: [
      "PUT /repos/{owner}/{repo}/actions/workflows/{workflow_id}/disable"
    ],
    downloadArtifact: [
      "GET /repos/{owner}/{repo}/actions/artifacts/{artifact_id}/{archive_format}"
    ],
    downloadJobLogsForWorkflowRun: [
      "GET /repos/{owner}/{repo}/actions/jobs/{job_id}/logs"
    ],
    downloadWorkflowRunAttemptLogs: [
      "GET /repos/{owner}/{repo}/actions/runs/{run_id}/attempts/{attempt_number}/logs"
    ],
    downloadWorkflowRunLogs: [
      "GET /repos/{owner}/{repo}/actions/runs/{run_id}/logs"
    ],
    enableSelectedRepositoryGithubActionsOrganization: [
      "PUT /orgs/{org}/actions/permissions/repositories/{repository_id}"
    ],
    enableWorkflow: [
      "PUT /repos/{owner}/{repo}/actions/workflows/{workflow_id}/enable"
    ],
    forceCancelWorkflowRun: [
      "POST /repos/{owner}/{repo}/actions/runs/{run_id}/force-cancel"
    ],
    generateRunnerJitconfigForOrg: [
      "POST /orgs/{org}/actions/runners/generate-jitconfig"
    ],
    generateRunnerJitconfigForRepo: [
      "POST /repos/{owner}/{repo}/actions/runners/generate-jitconfig"
    ],
    getActionsCacheList: ["GET /repos/{owner}/{repo}/actions/caches"],
    getActionsCacheUsage: ["GET /repos/{owner}/{repo}/actions/cache/usage"],
    getActionsCacheUsageByRepoForOrg: [
      "GET /orgs/{org}/actions/cache/usage-by-repository"
    ],
    getActionsCacheUsageForOrg: ["GET /orgs/{org}/actions/cache/usage"],
    getAllowedActionsOrganization: [
      "GET /orgs/{org}/actions/permissions/selected-actions"
    ],
    getAllowedActionsRepository: [
      "GET /repos/{owner}/{repo}/actions/permissions/selected-actions"
    ],
    getArtifact: ["GET /repos/{owner}/{repo}/actions/artifacts/{artifact_id}"],
    getCustomOidcSubClaimForRepo: [
      "GET /repos/{owner}/{repo}/actions/oidc/customization/sub"
    ],
    getEnvironmentPublicKey: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}/secrets/public-key"
    ],
    getEnvironmentSecret: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}/secrets/{secret_name}"
    ],
    getEnvironmentVariable: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}/variables/{name}"
    ],
    getGithubActionsDefaultWorkflowPermissionsOrganization: [
      "GET /orgs/{org}/actions/permissions/workflow"
    ],
    getGithubActionsDefaultWorkflowPermissionsRepository: [
      "GET /repos/{owner}/{repo}/actions/permissions/workflow"
    ],
    getGithubActionsPermissionsOrganization: [
      "GET /orgs/{org}/actions/permissions"
    ],
    getGithubActionsPermissionsRepository: [
      "GET /repos/{owner}/{repo}/actions/permissions"
    ],
    getHostedRunnerForOrg: [
      "GET /orgs/{org}/actions/hosted-runners/{hosted_runner_id}"
    ],
    getHostedRunnersGithubOwnedImagesForOrg: [
      "GET /orgs/{org}/actions/hosted-runners/images/github-owned"
    ],
    getHostedRunnersLimitsForOrg: [
      "GET /orgs/{org}/actions/hosted-runners/limits"
    ],
    getHostedRunnersMachineSpecsForOrg: [
      "GET /orgs/{org}/actions/hosted-runners/machine-sizes"
    ],
    getHostedRunnersPartnerImagesForOrg: [
      "GET /orgs/{org}/actions/hosted-runners/images/partner"
    ],
    getHostedRunnersPlatformsForOrg: [
      "GET /orgs/{org}/actions/hosted-runners/platforms"
    ],
    getJobForWorkflowRun: ["GET /repos/{owner}/{repo}/actions/jobs/{job_id}"],
    getOrgPublicKey: ["GET /orgs/{org}/actions/secrets/public-key"],
    getOrgSecret: ["GET /orgs/{org}/actions/secrets/{secret_name}"],
    getOrgVariable: ["GET /orgs/{org}/actions/variables/{name}"],
    getPendingDeploymentsForRun: [
      "GET /repos/{owner}/{repo}/actions/runs/{run_id}/pending_deployments"
    ],
    getRepoPermissions: [
      "GET /repos/{owner}/{repo}/actions/permissions",
      {},
      { renamed: ["actions", "getGithubActionsPermissionsRepository"] }
    ],
    getRepoPublicKey: ["GET /repos/{owner}/{repo}/actions/secrets/public-key"],
    getRepoSecret: ["GET /repos/{owner}/{repo}/actions/secrets/{secret_name}"],
    getRepoVariable: ["GET /repos/{owner}/{repo}/actions/variables/{name}"],
    getReviewsForRun: [
      "GET /repos/{owner}/{repo}/actions/runs/{run_id}/approvals"
    ],
    getSelfHostedRunnerForOrg: ["GET /orgs/{org}/actions/runners/{runner_id}"],
    getSelfHostedRunnerForRepo: [
      "GET /repos/{owner}/{repo}/actions/runners/{runner_id}"
    ],
    getWorkflow: ["GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}"],
    getWorkflowAccessToRepository: [
      "GET /repos/{owner}/{repo}/actions/permissions/access"
    ],
    getWorkflowRun: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}"],
    getWorkflowRunAttempt: [
      "GET /repos/{owner}/{repo}/actions/runs/{run_id}/attempts/{attempt_number}"
    ],
    getWorkflowRunUsage: [
      "GET /repos/{owner}/{repo}/actions/runs/{run_id}/timing"
    ],
    getWorkflowUsage: [
      "GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/timing"
    ],
    listArtifactsForRepo: ["GET /repos/{owner}/{repo}/actions/artifacts"],
    listEnvironmentSecrets: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}/secrets"
    ],
    listEnvironmentVariables: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}/variables"
    ],
    listGithubHostedRunnersInGroupForOrg: [
      "GET /orgs/{org}/actions/runner-groups/{runner_group_id}/hosted-runners"
    ],
    listHostedRunnersForOrg: ["GET /orgs/{org}/actions/hosted-runners"],
    listJobsForWorkflowRun: [
      "GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs"
    ],
    listJobsForWorkflowRunAttempt: [
      "GET /repos/{owner}/{repo}/actions/runs/{run_id}/attempts/{attempt_number}/jobs"
    ],
    listLabelsForSelfHostedRunnerForOrg: [
      "GET /orgs/{org}/actions/runners/{runner_id}/labels"
    ],
    listLabelsForSelfHostedRunnerForRepo: [
      "GET /repos/{owner}/{repo}/actions/runners/{runner_id}/labels"
    ],
    listOrgSecrets: ["GET /orgs/{org}/actions/secrets"],
    listOrgVariables: ["GET /orgs/{org}/actions/variables"],
    listRepoOrganizationSecrets: [
      "GET /repos/{owner}/{repo}/actions/organization-secrets"
    ],
    listRepoOrganizationVariables: [
      "GET /repos/{owner}/{repo}/actions/organization-variables"
    ],
    listRepoSecrets: ["GET /repos/{owner}/{repo}/actions/secrets"],
    listRepoVariables: ["GET /repos/{owner}/{repo}/actions/variables"],
    listRepoWorkflows: ["GET /repos/{owner}/{repo}/actions/workflows"],
    listRunnerApplicationsForOrg: ["GET /orgs/{org}/actions/runners/downloads"],
    listRunnerApplicationsForRepo: [
      "GET /repos/{owner}/{repo}/actions/runners/downloads"
    ],
    listSelectedReposForOrgSecret: [
      "GET /orgs/{org}/actions/secrets/{secret_name}/repositories"
    ],
    listSelectedReposForOrgVariable: [
      "GET /orgs/{org}/actions/variables/{name}/repositories"
    ],
    listSelectedRepositoriesEnabledGithubActionsOrganization: [
      "GET /orgs/{org}/actions/permissions/repositories"
    ],
    listSelfHostedRunnersForOrg: ["GET /orgs/{org}/actions/runners"],
    listSelfHostedRunnersForRepo: ["GET /repos/{owner}/{repo}/actions/runners"],
    listWorkflowRunArtifacts: [
      "GET /repos/{owner}/{repo}/actions/runs/{run_id}/artifacts"
    ],
    listWorkflowRuns: [
      "GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs"
    ],
    listWorkflowRunsForRepo: ["GET /repos/{owner}/{repo}/actions/runs"],
    reRunJobForWorkflowRun: [
      "POST /repos/{owner}/{repo}/actions/jobs/{job_id}/rerun"
    ],
    reRunWorkflow: ["POST /repos/{owner}/{repo}/actions/runs/{run_id}/rerun"],
    reRunWorkflowFailedJobs: [
      "POST /repos/{owner}/{repo}/actions/runs/{run_id}/rerun-failed-jobs"
    ],
    removeAllCustomLabelsFromSelfHostedRunnerForOrg: [
      "DELETE /orgs/{org}/actions/runners/{runner_id}/labels"
    ],
    removeAllCustomLabelsFromSelfHostedRunnerForRepo: [
      "DELETE /repos/{owner}/{repo}/actions/runners/{runner_id}/labels"
    ],
    removeCustomLabelFromSelfHostedRunnerForOrg: [
      "DELETE /orgs/{org}/actions/runners/{runner_id}/labels/{name}"
    ],
    removeCustomLabelFromSelfHostedRunnerForRepo: [
      "DELETE /repos/{owner}/{repo}/actions/runners/{runner_id}/labels/{name}"
    ],
    removeSelectedRepoFromOrgSecret: [
      "DELETE /orgs/{org}/actions/secrets/{secret_name}/repositories/{repository_id}"
    ],
    removeSelectedRepoFromOrgVariable: [
      "DELETE /orgs/{org}/actions/variables/{name}/repositories/{repository_id}"
    ],
    reviewCustomGatesForRun: [
      "POST /repos/{owner}/{repo}/actions/runs/{run_id}/deployment_protection_rule"
    ],
    reviewPendingDeploymentsForRun: [
      "POST /repos/{owner}/{repo}/actions/runs/{run_id}/pending_deployments"
    ],
    setAllowedActionsOrganization: [
      "PUT /orgs/{org}/actions/permissions/selected-actions"
    ],
    setAllowedActionsRepository: [
      "PUT /repos/{owner}/{repo}/actions/permissions/selected-actions"
    ],
    setCustomLabelsForSelfHostedRunnerForOrg: [
      "PUT /orgs/{org}/actions/runners/{runner_id}/labels"
    ],
    setCustomLabelsForSelfHostedRunnerForRepo: [
      "PUT /repos/{owner}/{repo}/actions/runners/{runner_id}/labels"
    ],
    setCustomOidcSubClaimForRepo: [
      "PUT /repos/{owner}/{repo}/actions/oidc/customization/sub"
    ],
    setGithubActionsDefaultWorkflowPermissionsOrganization: [
      "PUT /orgs/{org}/actions/permissions/workflow"
    ],
    setGithubActionsDefaultWorkflowPermissionsRepository: [
      "PUT /repos/{owner}/{repo}/actions/permissions/workflow"
    ],
    setGithubActionsPermissionsOrganization: [
      "PUT /orgs/{org}/actions/permissions"
    ],
    setGithubActionsPermissionsRepository: [
      "PUT /repos/{owner}/{repo}/actions/permissions"
    ],
    setSelectedReposForOrgSecret: [
      "PUT /orgs/{org}/actions/secrets/{secret_name}/repositories"
    ],
    setSelectedReposForOrgVariable: [
      "PUT /orgs/{org}/actions/variables/{name}/repositories"
    ],
    setSelectedRepositoriesEnabledGithubActionsOrganization: [
      "PUT /orgs/{org}/actions/permissions/repositories"
    ],
    setWorkflowAccessToRepository: [
      "PUT /repos/{owner}/{repo}/actions/permissions/access"
    ],
    updateEnvironmentVariable: [
      "PATCH /repos/{owner}/{repo}/environments/{environment_name}/variables/{name}"
    ],
    updateHostedRunnerForOrg: [
      "PATCH /orgs/{org}/actions/hosted-runners/{hosted_runner_id}"
    ],
    updateOrgVariable: ["PATCH /orgs/{org}/actions/variables/{name}"],
    updateRepoVariable: [
      "PATCH /repos/{owner}/{repo}/actions/variables/{name}"
    ]
  },
  activity: {
    checkRepoIsStarredByAuthenticatedUser: ["GET /user/starred/{owner}/{repo}"],
    deleteRepoSubscription: ["DELETE /repos/{owner}/{repo}/subscription"],
    deleteThreadSubscription: [
      "DELETE /notifications/threads/{thread_id}/subscription"
    ],
    getFeeds: ["GET /feeds"],
    getRepoSubscription: ["GET /repos/{owner}/{repo}/subscription"],
    getThread: ["GET /notifications/threads/{thread_id}"],
    getThreadSubscriptionForAuthenticatedUser: [
      "GET /notifications/threads/{thread_id}/subscription"
    ],
    listEventsForAuthenticatedUser: ["GET /users/{username}/events"],
    listNotificationsForAuthenticatedUser: ["GET /notifications"],
    listOrgEventsForAuthenticatedUser: [
      "GET /users/{username}/events/orgs/{org}"
    ],
    listPublicEvents: ["GET /events"],
    listPublicEventsForRepoNetwork: ["GET /networks/{owner}/{repo}/events"],
    listPublicEventsForUser: ["GET /users/{username}/events/public"],
    listPublicOrgEvents: ["GET /orgs/{org}/events"],
    listReceivedEventsForUser: ["GET /users/{username}/received_events"],
    listReceivedPublicEventsForUser: [
      "GET /users/{username}/received_events/public"
    ],
    listRepoEvents: ["GET /repos/{owner}/{repo}/events"],
    listRepoNotificationsForAuthenticatedUser: [
      "GET /repos/{owner}/{repo}/notifications"
    ],
    listReposStarredByAuthenticatedUser: ["GET /user/starred"],
    listReposStarredByUser: ["GET /users/{username}/starred"],
    listReposWatchedByUser: ["GET /users/{username}/subscriptions"],
    listStargazersForRepo: ["GET /repos/{owner}/{repo}/stargazers"],
    listWatchedReposForAuthenticatedUser: ["GET /user/subscriptions"],
    listWatchersForRepo: ["GET /repos/{owner}/{repo}/subscribers"],
    markNotificationsAsRead: ["PUT /notifications"],
    markRepoNotificationsAsRead: ["PUT /repos/{owner}/{repo}/notifications"],
    markThreadAsDone: ["DELETE /notifications/threads/{thread_id}"],
    markThreadAsRead: ["PATCH /notifications/threads/{thread_id}"],
    setRepoSubscription: ["PUT /repos/{owner}/{repo}/subscription"],
    setThreadSubscription: [
      "PUT /notifications/threads/{thread_id}/subscription"
    ],
    starRepoForAuthenticatedUser: ["PUT /user/starred/{owner}/{repo}"],
    unstarRepoForAuthenticatedUser: ["DELETE /user/starred/{owner}/{repo}"]
  },
  apps: {
    addRepoToInstallation: [
      "PUT /user/installations/{installation_id}/repositories/{repository_id}",
      {},
      { renamed: ["apps", "addRepoToInstallationForAuthenticatedUser"] }
    ],
    addRepoToInstallationForAuthenticatedUser: [
      "PUT /user/installations/{installation_id}/repositories/{repository_id}"
    ],
    checkToken: ["POST /applications/{client_id}/token"],
    createFromManifest: ["POST /app-manifests/{code}/conversions"],
    createInstallationAccessToken: [
      "POST /app/installations/{installation_id}/access_tokens"
    ],
    deleteAuthorization: ["DELETE /applications/{client_id}/grant"],
    deleteInstallation: ["DELETE /app/installations/{installation_id}"],
    deleteToken: ["DELETE /applications/{client_id}/token"],
    getAuthenticated: ["GET /app"],
    getBySlug: ["GET /apps/{app_slug}"],
    getInstallation: ["GET /app/installations/{installation_id}"],
    getOrgInstallation: ["GET /orgs/{org}/installation"],
    getRepoInstallation: ["GET /repos/{owner}/{repo}/installation"],
    getSubscriptionPlanForAccount: [
      "GET /marketplace_listing/accounts/{account_id}"
    ],
    getSubscriptionPlanForAccountStubbed: [
      "GET /marketplace_listing/stubbed/accounts/{account_id}"
    ],
    getUserInstallation: ["GET /users/{username}/installation"],
    getWebhookConfigForApp: ["GET /app/hook/config"],
    getWebhookDelivery: ["GET /app/hook/deliveries/{delivery_id}"],
    listAccountsForPlan: ["GET /marketplace_listing/plans/{plan_id}/accounts"],
    listAccountsForPlanStubbed: [
      "GET /marketplace_listing/stubbed/plans/{plan_id}/accounts"
    ],
    listInstallationReposForAuthenticatedUser: [
      "GET /user/installations/{installation_id}/repositories"
    ],
    listInstallationRequestsForAuthenticatedApp: [
      "GET /app/installation-requests"
    ],
    listInstallations: ["GET /app/installations"],
    listInstallationsForAuthenticatedUser: ["GET /user/installations"],
    listPlans: ["GET /marketplace_listing/plans"],
    listPlansStubbed: ["GET /marketplace_listing/stubbed/plans"],
    listReposAccessibleToInstallation: ["GET /installation/repositories"],
    listSubscriptionsForAuthenticatedUser: ["GET /user/marketplace_purchases"],
    listSubscriptionsForAuthenticatedUserStubbed: [
      "GET /user/marketplace_purchases/stubbed"
    ],
    listWebhookDeliveries: ["GET /app/hook/deliveries"],
    redeliverWebhookDelivery: [
      "POST /app/hook/deliveries/{delivery_id}/attempts"
    ],
    removeRepoFromInstallation: [
      "DELETE /user/installations/{installation_id}/repositories/{repository_id}",
      {},
      { renamed: ["apps", "removeRepoFromInstallationForAuthenticatedUser"] }
    ],
    removeRepoFromInstallationForAuthenticatedUser: [
      "DELETE /user/installations/{installation_id}/repositories/{repository_id}"
    ],
    resetToken: ["PATCH /applications/{client_id}/token"],
    revokeInstallationAccessToken: ["DELETE /installation/token"],
    scopeToken: ["POST /applications/{client_id}/token/scoped"],
    suspendInstallation: ["PUT /app/installations/{installation_id}/suspended"],
    unsuspendInstallation: [
      "DELETE /app/installations/{installation_id}/suspended"
    ],
    updateWebhookConfigForApp: ["PATCH /app/hook/config"]
  },
  billing: {
    getGithubActionsBillingOrg: ["GET /orgs/{org}/settings/billing/actions"],
    getGithubActionsBillingUser: [
      "GET /users/{username}/settings/billing/actions"
    ],
    getGithubBillingUsageReportOrg: [
      "GET /organizations/{org}/settings/billing/usage"
    ],
    getGithubPackagesBillingOrg: ["GET /orgs/{org}/settings/billing/packages"],
    getGithubPackagesBillingUser: [
      "GET /users/{username}/settings/billing/packages"
    ],
    getSharedStorageBillingOrg: [
      "GET /orgs/{org}/settings/billing/shared-storage"
    ],
    getSharedStorageBillingUser: [
      "GET /users/{username}/settings/billing/shared-storage"
    ]
  },
  campaigns: {
    createCampaign: ["POST /orgs/{org}/campaigns"],
    deleteCampaign: ["DELETE /orgs/{org}/campaigns/{campaign_number}"],
    getCampaignSummary: ["GET /orgs/{org}/campaigns/{campaign_number}"],
    listOrgCampaigns: ["GET /orgs/{org}/campaigns"],
    updateCampaign: ["PATCH /orgs/{org}/campaigns/{campaign_number}"]
  },
  checks: {
    create: ["POST /repos/{owner}/{repo}/check-runs"],
    createSuite: ["POST /repos/{owner}/{repo}/check-suites"],
    get: ["GET /repos/{owner}/{repo}/check-runs/{check_run_id}"],
    getSuite: ["GET /repos/{owner}/{repo}/check-suites/{check_suite_id}"],
    listAnnotations: [
      "GET /repos/{owner}/{repo}/check-runs/{check_run_id}/annotations"
    ],
    listForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/check-runs"],
    listForSuite: [
      "GET /repos/{owner}/{repo}/check-suites/{check_suite_id}/check-runs"
    ],
    listSuitesForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/check-suites"],
    rerequestRun: [
      "POST /repos/{owner}/{repo}/check-runs/{check_run_id}/rerequest"
    ],
    rerequestSuite: [
      "POST /repos/{owner}/{repo}/check-suites/{check_suite_id}/rerequest"
    ],
    setSuitesPreferences: [
      "PATCH /repos/{owner}/{repo}/check-suites/preferences"
    ],
    update: ["PATCH /repos/{owner}/{repo}/check-runs/{check_run_id}"]
  },
  codeScanning: {
    commitAutofix: [
      "POST /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/autofix/commits"
    ],
    createAutofix: [
      "POST /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/autofix"
    ],
    createVariantAnalysis: [
      "POST /repos/{owner}/{repo}/code-scanning/codeql/variant-analyses"
    ],
    deleteAnalysis: [
      "DELETE /repos/{owner}/{repo}/code-scanning/analyses/{analysis_id}{?confirm_delete}"
    ],
    deleteCodeqlDatabase: [
      "DELETE /repos/{owner}/{repo}/code-scanning/codeql/databases/{language}"
    ],
    getAlert: [
      "GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}",
      {},
      { renamedParameters: { alert_id: "alert_number" } }
    ],
    getAnalysis: [
      "GET /repos/{owner}/{repo}/code-scanning/analyses/{analysis_id}"
    ],
    getAutofix: [
      "GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/autofix"
    ],
    getCodeqlDatabase: [
      "GET /repos/{owner}/{repo}/code-scanning/codeql/databases/{language}"
    ],
    getDefaultSetup: ["GET /repos/{owner}/{repo}/code-scanning/default-setup"],
    getSarif: ["GET /repos/{owner}/{repo}/code-scanning/sarifs/{sarif_id}"],
    getVariantAnalysis: [
      "GET /repos/{owner}/{repo}/code-scanning/codeql/variant-analyses/{codeql_variant_analysis_id}"
    ],
    getVariantAnalysisRepoTask: [
      "GET /repos/{owner}/{repo}/code-scanning/codeql/variant-analyses/{codeql_variant_analysis_id}/repos/{repo_owner}/{repo_name}"
    ],
    listAlertInstances: [
      "GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/instances"
    ],
    listAlertsForOrg: ["GET /orgs/{org}/code-scanning/alerts"],
    listAlertsForRepo: ["GET /repos/{owner}/{repo}/code-scanning/alerts"],
    listAlertsInstances: [
      "GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/instances",
      {},
      { renamed: ["codeScanning", "listAlertInstances"] }
    ],
    listCodeqlDatabases: [
      "GET /repos/{owner}/{repo}/code-scanning/codeql/databases"
    ],
    listRecentAnalyses: ["GET /repos/{owner}/{repo}/code-scanning/analyses"],
    updateAlert: [
      "PATCH /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}"
    ],
    updateDefaultSetup: [
      "PATCH /repos/{owner}/{repo}/code-scanning/default-setup"
    ],
    uploadSarif: ["POST /repos/{owner}/{repo}/code-scanning/sarifs"]
  },
  codeSecurity: {
    attachConfiguration: [
      "POST /orgs/{org}/code-security/configurations/{configuration_id}/attach"
    ],
    attachEnterpriseConfiguration: [
      "POST /enterprises/{enterprise}/code-security/configurations/{configuration_id}/attach"
    ],
    createConfiguration: ["POST /orgs/{org}/code-security/configurations"],
    createConfigurationForEnterprise: [
      "POST /enterprises/{enterprise}/code-security/configurations"
    ],
    deleteConfiguration: [
      "DELETE /orgs/{org}/code-security/configurations/{configuration_id}"
    ],
    deleteConfigurationForEnterprise: [
      "DELETE /enterprises/{enterprise}/code-security/configurations/{configuration_id}"
    ],
    detachConfiguration: [
      "DELETE /orgs/{org}/code-security/configurations/detach"
    ],
    getConfiguration: [
      "GET /orgs/{org}/code-security/configurations/{configuration_id}"
    ],
    getConfigurationForRepository: [
      "GET /repos/{owner}/{repo}/code-security-configuration"
    ],
    getConfigurationsForEnterprise: [
      "GET /enterprises/{enterprise}/code-security/configurations"
    ],
    getConfigurationsForOrg: ["GET /orgs/{org}/code-security/configurations"],
    getDefaultConfigurations: [
      "GET /orgs/{org}/code-security/configurations/defaults"
    ],
    getDefaultConfigurationsForEnterprise: [
      "GET /enterprises/{enterprise}/code-security/configurations/defaults"
    ],
    getRepositoriesForConfiguration: [
      "GET /orgs/{org}/code-security/configurations/{configuration_id}/repositories"
    ],
    getRepositoriesForEnterpriseConfiguration: [
      "GET /enterprises/{enterprise}/code-security/configurations/{configuration_id}/repositories"
    ],
    getSingleConfigurationForEnterprise: [
      "GET /enterprises/{enterprise}/code-security/configurations/{configuration_id}"
    ],
    setConfigurationAsDefault: [
      "PUT /orgs/{org}/code-security/configurations/{configuration_id}/defaults"
    ],
    setConfigurationAsDefaultForEnterprise: [
      "PUT /enterprises/{enterprise}/code-security/configurations/{configuration_id}/defaults"
    ],
    updateConfiguration: [
      "PATCH /orgs/{org}/code-security/configurations/{configuration_id}"
    ],
    updateEnterpriseConfiguration: [
      "PATCH /enterprises/{enterprise}/code-security/configurations/{configuration_id}"
    ]
  },
  codesOfConduct: {
    getAllCodesOfConduct: ["GET /codes_of_conduct"],
    getConductCode: ["GET /codes_of_conduct/{key}"]
  },
  codespaces: {
    addRepositoryForSecretForAuthenticatedUser: [
      "PUT /user/codespaces/secrets/{secret_name}/repositories/{repository_id}"
    ],
    addSelectedRepoToOrgSecret: [
      "PUT /orgs/{org}/codespaces/secrets/{secret_name}/repositories/{repository_id}"
    ],
    checkPermissionsForDevcontainer: [
      "GET /repos/{owner}/{repo}/codespaces/permissions_check"
    ],
    codespaceMachinesForAuthenticatedUser: [
      "GET /user/codespaces/{codespace_name}/machines"
    ],
    createForAuthenticatedUser: ["POST /user/codespaces"],
    createOrUpdateOrgSecret: [
      "PUT /orgs/{org}/codespaces/secrets/{secret_name}"
    ],
    createOrUpdateRepoSecret: [
      "PUT /repos/{owner}/{repo}/codespaces/secrets/{secret_name}"
    ],
    createOrUpdateSecretForAuthenticatedUser: [
      "PUT /user/codespaces/secrets/{secret_name}"
    ],
    createWithPrForAuthenticatedUser: [
      "POST /repos/{owner}/{repo}/pulls/{pull_number}/codespaces"
    ],
    createWithRepoForAuthenticatedUser: [
      "POST /repos/{owner}/{repo}/codespaces"
    ],
    deleteForAuthenticatedUser: ["DELETE /user/codespaces/{codespace_name}"],
    deleteFromOrganization: [
      "DELETE /orgs/{org}/members/{username}/codespaces/{codespace_name}"
    ],
    deleteOrgSecret: ["DELETE /orgs/{org}/codespaces/secrets/{secret_name}"],
    deleteRepoSecret: [
      "DELETE /repos/{owner}/{repo}/codespaces/secrets/{secret_name}"
    ],
    deleteSecretForAuthenticatedUser: [
      "DELETE /user/codespaces/secrets/{secret_name}"
    ],
    exportForAuthenticatedUser: [
      "POST /user/codespaces/{codespace_name}/exports"
    ],
    getCodespacesForUserInOrg: [
      "GET /orgs/{org}/members/{username}/codespaces"
    ],
    getExportDetailsForAuthenticatedUser: [
      "GET /user/codespaces/{codespace_name}/exports/{export_id}"
    ],
    getForAuthenticatedUser: ["GET /user/codespaces/{codespace_name}"],
    getOrgPublicKey: ["GET /orgs/{org}/codespaces/secrets/public-key"],
    getOrgSecret: ["GET /orgs/{org}/codespaces/secrets/{secret_name}"],
    getPublicKeyForAuthenticatedUser: [
      "GET /user/codespaces/secrets/public-key"
    ],
    getRepoPublicKey: [
      "GET /repos/{owner}/{repo}/codespaces/secrets/public-key"
    ],
    getRepoSecret: [
      "GET /repos/{owner}/{repo}/codespaces/secrets/{secret_name}"
    ],
    getSecretForAuthenticatedUser: [
      "GET /user/codespaces/secrets/{secret_name}"
    ],
    listDevcontainersInRepositoryForAuthenticatedUser: [
      "GET /repos/{owner}/{repo}/codespaces/devcontainers"
    ],
    listForAuthenticatedUser: ["GET /user/codespaces"],
    listInOrganization: [
      "GET /orgs/{org}/codespaces",
      {},
      { renamedParameters: { org_id: "org" } }
    ],
    listInRepositoryForAuthenticatedUser: [
      "GET /repos/{owner}/{repo}/codespaces"
    ],
    listOrgSecrets: ["GET /orgs/{org}/codespaces/secrets"],
    listRepoSecrets: ["GET /repos/{owner}/{repo}/codespaces/secrets"],
    listRepositoriesForSecretForAuthenticatedUser: [
      "GET /user/codespaces/secrets/{secret_name}/repositories"
    ],
    listSecretsForAuthenticatedUser: ["GET /user/codespaces/secrets"],
    listSelectedReposForOrgSecret: [
      "GET /orgs/{org}/codespaces/secrets/{secret_name}/repositories"
    ],
    preFlightWithRepoForAuthenticatedUser: [
      "GET /repos/{owner}/{repo}/codespaces/new"
    ],
    publishForAuthenticatedUser: [
      "POST /user/codespaces/{codespace_name}/publish"
    ],
    removeRepositoryForSecretForAuthenticatedUser: [
      "DELETE /user/codespaces/secrets/{secret_name}/repositories/{repository_id}"
    ],
    removeSelectedRepoFromOrgSecret: [
      "DELETE /orgs/{org}/codespaces/secrets/{secret_name}/repositories/{repository_id}"
    ],
    repoMachinesForAuthenticatedUser: [
      "GET /repos/{owner}/{repo}/codespaces/machines"
    ],
    setRepositoriesForSecretForAuthenticatedUser: [
      "PUT /user/codespaces/secrets/{secret_name}/repositories"
    ],
    setSelectedReposForOrgSecret: [
      "PUT /orgs/{org}/codespaces/secrets/{secret_name}/repositories"
    ],
    startForAuthenticatedUser: ["POST /user/codespaces/{codespace_name}/start"],
    stopForAuthenticatedUser: ["POST /user/codespaces/{codespace_name}/stop"],
    stopInOrganization: [
      "POST /orgs/{org}/members/{username}/codespaces/{codespace_name}/stop"
    ],
    updateForAuthenticatedUser: ["PATCH /user/codespaces/{codespace_name}"]
  },
  copilot: {
    addCopilotSeatsForTeams: [
      "POST /orgs/{org}/copilot/billing/selected_teams"
    ],
    addCopilotSeatsForUsers: [
      "POST /orgs/{org}/copilot/billing/selected_users"
    ],
    cancelCopilotSeatAssignmentForTeams: [
      "DELETE /orgs/{org}/copilot/billing/selected_teams"
    ],
    cancelCopilotSeatAssignmentForUsers: [
      "DELETE /orgs/{org}/copilot/billing/selected_users"
    ],
    copilotMetricsForOrganization: ["GET /orgs/{org}/copilot/metrics"],
    copilotMetricsForTeam: ["GET /orgs/{org}/team/{team_slug}/copilot/metrics"],
    getCopilotOrganizationDetails: ["GET /orgs/{org}/copilot/billing"],
    getCopilotSeatDetailsForUser: [
      "GET /orgs/{org}/members/{username}/copilot"
    ],
    listCopilotSeats: ["GET /orgs/{org}/copilot/billing/seats"]
  },
  dependabot: {
    addSelectedRepoToOrgSecret: [
      "PUT /orgs/{org}/dependabot/secrets/{secret_name}/repositories/{repository_id}"
    ],
    createOrUpdateOrgSecret: [
      "PUT /orgs/{org}/dependabot/secrets/{secret_name}"
    ],
    createOrUpdateRepoSecret: [
      "PUT /repos/{owner}/{repo}/dependabot/secrets/{secret_name}"
    ],
    deleteOrgSecret: ["DELETE /orgs/{org}/dependabot/secrets/{secret_name}"],
    deleteRepoSecret: [
      "DELETE /repos/{owner}/{repo}/dependabot/secrets/{secret_name}"
    ],
    getAlert: ["GET /repos/{owner}/{repo}/dependabot/alerts/{alert_number}"],
    getOrgPublicKey: ["GET /orgs/{org}/dependabot/secrets/public-key"],
    getOrgSecret: ["GET /orgs/{org}/dependabot/secrets/{secret_name}"],
    getRepoPublicKey: [
      "GET /repos/{owner}/{repo}/dependabot/secrets/public-key"
    ],
    getRepoSecret: [
      "GET /repos/{owner}/{repo}/dependabot/secrets/{secret_name}"
    ],
    listAlertsForEnterprise: [
      "GET /enterprises/{enterprise}/dependabot/alerts"
    ],
    listAlertsForOrg: ["GET /orgs/{org}/dependabot/alerts"],
    listAlertsForRepo: ["GET /repos/{owner}/{repo}/dependabot/alerts"],
    listOrgSecrets: ["GET /orgs/{org}/dependabot/secrets"],
    listRepoSecrets: ["GET /repos/{owner}/{repo}/dependabot/secrets"],
    listSelectedReposForOrgSecret: [
      "GET /orgs/{org}/dependabot/secrets/{secret_name}/repositories"
    ],
    removeSelectedRepoFromOrgSecret: [
      "DELETE /orgs/{org}/dependabot/secrets/{secret_name}/repositories/{repository_id}"
    ],
    setSelectedReposForOrgSecret: [
      "PUT /orgs/{org}/dependabot/secrets/{secret_name}/repositories"
    ],
    updateAlert: [
      "PATCH /repos/{owner}/{repo}/dependabot/alerts/{alert_number}"
    ]
  },
  dependencyGraph: {
    createRepositorySnapshot: [
      "POST /repos/{owner}/{repo}/dependency-graph/snapshots"
    ],
    diffRange: [
      "GET /repos/{owner}/{repo}/dependency-graph/compare/{basehead}"
    ],
    exportSbom: ["GET /repos/{owner}/{repo}/dependency-graph/sbom"]
  },
  emojis: { get: ["GET /emojis"] },
  gists: {
    checkIsStarred: ["GET /gists/{gist_id}/star"],
    create: ["POST /gists"],
    createComment: ["POST /gists/{gist_id}/comments"],
    delete: ["DELETE /gists/{gist_id}"],
    deleteComment: ["DELETE /gists/{gist_id}/comments/{comment_id}"],
    fork: ["POST /gists/{gist_id}/forks"],
    get: ["GET /gists/{gist_id}"],
    getComment: ["GET /gists/{gist_id}/comments/{comment_id}"],
    getRevision: ["GET /gists/{gist_id}/{sha}"],
    list: ["GET /gists"],
    listComments: ["GET /gists/{gist_id}/comments"],
    listCommits: ["GET /gists/{gist_id}/commits"],
    listForUser: ["GET /users/{username}/gists"],
    listForks: ["GET /gists/{gist_id}/forks"],
    listPublic: ["GET /gists/public"],
    listStarred: ["GET /gists/starred"],
    star: ["PUT /gists/{gist_id}/star"],
    unstar: ["DELETE /gists/{gist_id}/star"],
    update: ["PATCH /gists/{gist_id}"],
    updateComment: ["PATCH /gists/{gist_id}/comments/{comment_id}"]
  },
  git: {
    createBlob: ["POST /repos/{owner}/{repo}/git/blobs"],
    createCommit: ["POST /repos/{owner}/{repo}/git/commits"],
    createRef: ["POST /repos/{owner}/{repo}/git/refs"],
    createTag: ["POST /repos/{owner}/{repo}/git/tags"],
    createTree: ["POST /repos/{owner}/{repo}/git/trees"],
    deleteRef: ["DELETE /repos/{owner}/{repo}/git/refs/{ref}"],
    getBlob: ["GET /repos/{owner}/{repo}/git/blobs/{file_sha}"],
    getCommit: ["GET /repos/{owner}/{repo}/git/commits/{commit_sha}"],
    getRef: ["GET /repos/{owner}/{repo}/git/ref/{ref}"],
    getTag: ["GET /repos/{owner}/{repo}/git/tags/{tag_sha}"],
    getTree: ["GET /repos/{owner}/{repo}/git/trees/{tree_sha}"],
    listMatchingRefs: ["GET /repos/{owner}/{repo}/git/matching-refs/{ref}"],
    updateRef: ["PATCH /repos/{owner}/{repo}/git/refs/{ref}"]
  },
  gitignore: {
    getAllTemplates: ["GET /gitignore/templates"],
    getTemplate: ["GET /gitignore/templates/{name}"]
  },
  hostedCompute: {
    createNetworkConfigurationForOrg: [
      "POST /orgs/{org}/settings/network-configurations"
    ],
    deleteNetworkConfigurationFromOrg: [
      "DELETE /orgs/{org}/settings/network-configurations/{network_configuration_id}"
    ],
    getNetworkConfigurationForOrg: [
      "GET /orgs/{org}/settings/network-configurations/{network_configuration_id}"
    ],
    getNetworkSettingsForOrg: [
      "GET /orgs/{org}/settings/network-settings/{network_settings_id}"
    ],
    listNetworkConfigurationsForOrg: [
      "GET /orgs/{org}/settings/network-configurations"
    ],
    updateNetworkConfigurationForOrg: [
      "PATCH /orgs/{org}/settings/network-configurations/{network_configuration_id}"
    ]
  },
  interactions: {
    getRestrictionsForAuthenticatedUser: ["GET /user/interaction-limits"],
    getRestrictionsForOrg: ["GET /orgs/{org}/interaction-limits"],
    getRestrictionsForRepo: ["GET /repos/{owner}/{repo}/interaction-limits"],
    getRestrictionsForYourPublicRepos: [
      "GET /user/interaction-limits",
      {},
      { renamed: ["interactions", "getRestrictionsForAuthenticatedUser"] }
    ],
    removeRestrictionsForAuthenticatedUser: ["DELETE /user/interaction-limits"],
    removeRestrictionsForOrg: ["DELETE /orgs/{org}/interaction-limits"],
    removeRestrictionsForRepo: [
      "DELETE /repos/{owner}/{repo}/interaction-limits"
    ],
    removeRestrictionsForYourPublicRepos: [
      "DELETE /user/interaction-limits",
      {},
      { renamed: ["interactions", "removeRestrictionsForAuthenticatedUser"] }
    ],
    setRestrictionsForAuthenticatedUser: ["PUT /user/interaction-limits"],
    setRestrictionsForOrg: ["PUT /orgs/{org}/interaction-limits"],
    setRestrictionsForRepo: ["PUT /repos/{owner}/{repo}/interaction-limits"],
    setRestrictionsForYourPublicRepos: [
      "PUT /user/interaction-limits",
      {},
      { renamed: ["interactions", "setRestrictionsForAuthenticatedUser"] }
    ]
  },
  issues: {
    addAssignees: [
      "POST /repos/{owner}/{repo}/issues/{issue_number}/assignees"
    ],
    addLabels: ["POST /repos/{owner}/{repo}/issues/{issue_number}/labels"],
    addSubIssue: [
      "POST /repos/{owner}/{repo}/issues/{issue_number}/sub_issues"
    ],
    checkUserCanBeAssigned: ["GET /repos/{owner}/{repo}/assignees/{assignee}"],
    checkUserCanBeAssignedToIssue: [
      "GET /repos/{owner}/{repo}/issues/{issue_number}/assignees/{assignee}"
    ],
    create: ["POST /repos/{owner}/{repo}/issues"],
    createComment: [
      "POST /repos/{owner}/{repo}/issues/{issue_number}/comments"
    ],
    createLabel: ["POST /repos/{owner}/{repo}/labels"],
    createMilestone: ["POST /repos/{owner}/{repo}/milestones"],
    deleteComment: [
      "DELETE /repos/{owner}/{repo}/issues/comments/{comment_id}"
    ],
    deleteLabel: ["DELETE /repos/{owner}/{repo}/labels/{name}"],
    deleteMilestone: [
      "DELETE /repos/{owner}/{repo}/milestones/{milestone_number}"
    ],
    get: ["GET /repos/{owner}/{repo}/issues/{issue_number}"],
    getComment: ["GET /repos/{owner}/{repo}/issues/comments/{comment_id}"],
    getEvent: ["GET /repos/{owner}/{repo}/issues/events/{event_id}"],
    getLabel: ["GET /repos/{owner}/{repo}/labels/{name}"],
    getMilestone: ["GET /repos/{owner}/{repo}/milestones/{milestone_number}"],
    list: ["GET /issues"],
    listAssignees: ["GET /repos/{owner}/{repo}/assignees"],
    listComments: ["GET /repos/{owner}/{repo}/issues/{issue_number}/comments"],
    listCommentsForRepo: ["GET /repos/{owner}/{repo}/issues/comments"],
    listEvents: ["GET /repos/{owner}/{repo}/issues/{issue_number}/events"],
    listEventsForRepo: ["GET /repos/{owner}/{repo}/issues/events"],
    listEventsForTimeline: [
      "GET /repos/{owner}/{repo}/issues/{issue_number}/timeline"
    ],
    listForAuthenticatedUser: ["GET /user/issues"],
    listForOrg: ["GET /orgs/{org}/issues"],
    listForRepo: ["GET /repos/{owner}/{repo}/issues"],
    listLabelsForMilestone: [
      "GET /repos/{owner}/{repo}/milestones/{milestone_number}/labels"
    ],
    listLabelsForRepo: ["GET /repos/{owner}/{repo}/labels"],
    listLabelsOnIssue: [
      "GET /repos/{owner}/{repo}/issues/{issue_number}/labels"
    ],
    listMilestones: ["GET /repos/{owner}/{repo}/milestones"],
    listSubIssues: [
      "GET /repos/{owner}/{repo}/issues/{issue_number}/sub_issues"
    ],
    lock: ["PUT /repos/{owner}/{repo}/issues/{issue_number}/lock"],
    removeAllLabels: [
      "DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels"
    ],
    removeAssignees: [
      "DELETE /repos/{owner}/{repo}/issues/{issue_number}/assignees"
    ],
    removeLabel: [
      "DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels/{name}"
    ],
    removeSubIssue: [
      "DELETE /repos/{owner}/{repo}/issues/{issue_number}/sub_issue"
    ],
    reprioritizeSubIssue: [
      "PATCH /repos/{owner}/{repo}/issues/{issue_number}/sub_issues/priority"
    ],
    setLabels: ["PUT /repos/{owner}/{repo}/issues/{issue_number}/labels"],
    unlock: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/lock"],
    update: ["PATCH /repos/{owner}/{repo}/issues/{issue_number}"],
    updateComment: ["PATCH /repos/{owner}/{repo}/issues/comments/{comment_id}"],
    updateLabel: ["PATCH /repos/{owner}/{repo}/labels/{name}"],
    updateMilestone: [
      "PATCH /repos/{owner}/{repo}/milestones/{milestone_number}"
    ]
  },
  licenses: {
    get: ["GET /licenses/{license}"],
    getAllCommonlyUsed: ["GET /licenses"],
    getForRepo: ["GET /repos/{owner}/{repo}/license"]
  },
  markdown: {
    render: ["POST /markdown"],
    renderRaw: [
      "POST /markdown/raw",
      { headers: { "content-type": "text/plain; charset=utf-8" } }
    ]
  },
  meta: {
    get: ["GET /meta"],
    getAllVersions: ["GET /versions"],
    getOctocat: ["GET /octocat"],
    getZen: ["GET /zen"],
    root: ["GET /"]
  },
  migrations: {
    deleteArchiveForAuthenticatedUser: [
      "DELETE /user/migrations/{migration_id}/archive"
    ],
    deleteArchiveForOrg: [
      "DELETE /orgs/{org}/migrations/{migration_id}/archive"
    ],
    downloadArchiveForOrg: [
      "GET /orgs/{org}/migrations/{migration_id}/archive"
    ],
    getArchiveForAuthenticatedUser: [
      "GET /user/migrations/{migration_id}/archive"
    ],
    getStatusForAuthenticatedUser: ["GET /user/migrations/{migration_id}"],
    getStatusForOrg: ["GET /orgs/{org}/migrations/{migration_id}"],
    listForAuthenticatedUser: ["GET /user/migrations"],
    listForOrg: ["GET /orgs/{org}/migrations"],
    listReposForAuthenticatedUser: [
      "GET /user/migrations/{migration_id}/repositories"
    ],
    listReposForOrg: ["GET /orgs/{org}/migrations/{migration_id}/repositories"],
    listReposForUser: [
      "GET /user/migrations/{migration_id}/repositories",
      {},
      { renamed: ["migrations", "listReposForAuthenticatedUser"] }
    ],
    startForAuthenticatedUser: ["POST /user/migrations"],
    startForOrg: ["POST /orgs/{org}/migrations"],
    unlockRepoForAuthenticatedUser: [
      "DELETE /user/migrations/{migration_id}/repos/{repo_name}/lock"
    ],
    unlockRepoForOrg: [
      "DELETE /orgs/{org}/migrations/{migration_id}/repos/{repo_name}/lock"
    ]
  },
  oidc: {
    getOidcCustomSubTemplateForOrg: [
      "GET /orgs/{org}/actions/oidc/customization/sub"
    ],
    updateOidcCustomSubTemplateForOrg: [
      "PUT /orgs/{org}/actions/oidc/customization/sub"
    ]
  },
  orgs: {
    addSecurityManagerTeam: [
      "PUT /orgs/{org}/security-managers/teams/{team_slug}",
      {},
      {
        deprecated: "octokit.rest.orgs.addSecurityManagerTeam() is deprecated, see https://docs.github.com/rest/orgs/security-managers#add-a-security-manager-team"
      }
    ],
    assignTeamToOrgRole: [
      "PUT /orgs/{org}/organization-roles/teams/{team_slug}/{role_id}"
    ],
    assignUserToOrgRole: [
      "PUT /orgs/{org}/organization-roles/users/{username}/{role_id}"
    ],
    blockUser: ["PUT /orgs/{org}/blocks/{username}"],
    cancelInvitation: ["DELETE /orgs/{org}/invitations/{invitation_id}"],
    checkBlockedUser: ["GET /orgs/{org}/blocks/{username}"],
    checkMembershipForUser: ["GET /orgs/{org}/members/{username}"],
    checkPublicMembershipForUser: ["GET /orgs/{org}/public_members/{username}"],
    convertMemberToOutsideCollaborator: [
      "PUT /orgs/{org}/outside_collaborators/{username}"
    ],
    createInvitation: ["POST /orgs/{org}/invitations"],
    createIssueType: ["POST /orgs/{org}/issue-types"],
    createOrUpdateCustomProperties: ["PATCH /orgs/{org}/properties/schema"],
    createOrUpdateCustomPropertiesValuesForRepos: [
      "PATCH /orgs/{org}/properties/values"
    ],
    createOrUpdateCustomProperty: [
      "PUT /orgs/{org}/properties/schema/{custom_property_name}"
    ],
    createWebhook: ["POST /orgs/{org}/hooks"],
    delete: ["DELETE /orgs/{org}"],
    deleteIssueType: ["DELETE /orgs/{org}/issue-types/{issue_type_id}"],
    deleteWebhook: ["DELETE /orgs/{org}/hooks/{hook_id}"],
    enableOrDisableSecurityProductOnAllOrgRepos: [
      "POST /orgs/{org}/{security_product}/{enablement}",
      {},
      {
        deprecated: "octokit.rest.orgs.enableOrDisableSecurityProductOnAllOrgRepos() is deprecated, see https://docs.github.com/rest/orgs/orgs#enable-or-disable-a-security-feature-for-an-organization"
      }
    ],
    get: ["GET /orgs/{org}"],
    getAllCustomProperties: ["GET /orgs/{org}/properties/schema"],
    getCustomProperty: [
      "GET /orgs/{org}/properties/schema/{custom_property_name}"
    ],
    getMembershipForAuthenticatedUser: ["GET /user/memberships/orgs/{org}"],
    getMembershipForUser: ["GET /orgs/{org}/memberships/{username}"],
    getOrgRole: ["GET /orgs/{org}/organization-roles/{role_id}"],
    getOrgRulesetHistory: ["GET /orgs/{org}/rulesets/{ruleset_id}/history"],
    getOrgRulesetVersion: [
      "GET /orgs/{org}/rulesets/{ruleset_id}/history/{version_id}"
    ],
    getWebhook: ["GET /orgs/{org}/hooks/{hook_id}"],
    getWebhookConfigForOrg: ["GET /orgs/{org}/hooks/{hook_id}/config"],
    getWebhookDelivery: [
      "GET /orgs/{org}/hooks/{hook_id}/deliveries/{delivery_id}"
    ],
    list: ["GET /organizations"],
    listAppInstallations: ["GET /orgs/{org}/installations"],
    listAttestations: ["GET /orgs/{org}/attestations/{subject_digest}"],
    listBlockedUsers: ["GET /orgs/{org}/blocks"],
    listCustomPropertiesValuesForRepos: ["GET /orgs/{org}/properties/values"],
    listFailedInvitations: ["GET /orgs/{org}/failed_invitations"],
    listForAuthenticatedUser: ["GET /user/orgs"],
    listForUser: ["GET /users/{username}/orgs"],
    listInvitationTeams: ["GET /orgs/{org}/invitations/{invitation_id}/teams"],
    listIssueTypes: ["GET /orgs/{org}/issue-types"],
    listMembers: ["GET /orgs/{org}/members"],
    listMembershipsForAuthenticatedUser: ["GET /user/memberships/orgs"],
    listOrgRoleTeams: ["GET /orgs/{org}/organization-roles/{role_id}/teams"],
    listOrgRoleUsers: ["GET /orgs/{org}/organization-roles/{role_id}/users"],
    listOrgRoles: ["GET /orgs/{org}/organization-roles"],
    listOrganizationFineGrainedPermissions: [
      "GET /orgs/{org}/organization-fine-grained-permissions"
    ],
    listOutsideCollaborators: ["GET /orgs/{org}/outside_collaborators"],
    listPatGrantRepositories: [
      "GET /orgs/{org}/personal-access-tokens/{pat_id}/repositories"
    ],
    listPatGrantRequestRepositories: [
      "GET /orgs/{org}/personal-access-token-requests/{pat_request_id}/repositories"
    ],
    listPatGrantRequests: ["GET /orgs/{org}/personal-access-token-requests"],
    listPatGrants: ["GET /orgs/{org}/personal-access-tokens"],
    listPendingInvitations: ["GET /orgs/{org}/invitations"],
    listPublicMembers: ["GET /orgs/{org}/public_members"],
    listSecurityManagerTeams: [
      "GET /orgs/{org}/security-managers",
      {},
      {
        deprecated: "octokit.rest.orgs.listSecurityManagerTeams() is deprecated, see https://docs.github.com/rest/orgs/security-managers#list-security-manager-teams"
      }
    ],
    listWebhookDeliveries: ["GET /orgs/{org}/hooks/{hook_id}/deliveries"],
    listWebhooks: ["GET /orgs/{org}/hooks"],
    pingWebhook: ["POST /orgs/{org}/hooks/{hook_id}/pings"],
    redeliverWebhookDelivery: [
      "POST /orgs/{org}/hooks/{hook_id}/deliveries/{delivery_id}/attempts"
    ],
    removeCustomProperty: [
      "DELETE /orgs/{org}/properties/schema/{custom_property_name}"
    ],
    removeMember: ["DELETE /orgs/{org}/members/{username}"],
    removeMembershipForUser: ["DELETE /orgs/{org}/memberships/{username}"],
    removeOutsideCollaborator: [
      "DELETE /orgs/{org}/outside_collaborators/{username}"
    ],
    removePublicMembershipForAuthenticatedUser: [
      "DELETE /orgs/{org}/public_members/{username}"
    ],
    removeSecurityManagerTeam: [
      "DELETE /orgs/{org}/security-managers/teams/{team_slug}",
      {},
      {
        deprecated: "octokit.rest.orgs.removeSecurityManagerTeam() is deprecated, see https://docs.github.com/rest/orgs/security-managers#remove-a-security-manager-team"
      }
    ],
    reviewPatGrantRequest: [
      "POST /orgs/{org}/personal-access-token-requests/{pat_request_id}"
    ],
    reviewPatGrantRequestsInBulk: [
      "POST /orgs/{org}/personal-access-token-requests"
    ],
    revokeAllOrgRolesTeam: [
      "DELETE /orgs/{org}/organization-roles/teams/{team_slug}"
    ],
    revokeAllOrgRolesUser: [
      "DELETE /orgs/{org}/organization-roles/users/{username}"
    ],
    revokeOrgRoleTeam: [
      "DELETE /orgs/{org}/organization-roles/teams/{team_slug}/{role_id}"
    ],
    revokeOrgRoleUser: [
      "DELETE /orgs/{org}/organization-roles/users/{username}/{role_id}"
    ],
    setMembershipForUser: ["PUT /orgs/{org}/memberships/{username}"],
    setPublicMembershipForAuthenticatedUser: [
      "PUT /orgs/{org}/public_members/{username}"
    ],
    unblockUser: ["DELETE /orgs/{org}/blocks/{username}"],
    update: ["PATCH /orgs/{org}"],
    updateIssueType: ["PUT /orgs/{org}/issue-types/{issue_type_id}"],
    updateMembershipForAuthenticatedUser: [
      "PATCH /user/memberships/orgs/{org}"
    ],
    updatePatAccess: ["POST /orgs/{org}/personal-access-tokens/{pat_id}"],
    updatePatAccesses: ["POST /orgs/{org}/personal-access-tokens"],
    updateWebhook: ["PATCH /orgs/{org}/hooks/{hook_id}"],
    updateWebhookConfigForOrg: ["PATCH /orgs/{org}/hooks/{hook_id}/config"]
  },
  packages: {
    deletePackageForAuthenticatedUser: [
      "DELETE /user/packages/{package_type}/{package_name}"
    ],
    deletePackageForOrg: [
      "DELETE /orgs/{org}/packages/{package_type}/{package_name}"
    ],
    deletePackageForUser: [
      "DELETE /users/{username}/packages/{package_type}/{package_name}"
    ],
    deletePackageVersionForAuthenticatedUser: [
      "DELETE /user/packages/{package_type}/{package_name}/versions/{package_version_id}"
    ],
    deletePackageVersionForOrg: [
      "DELETE /orgs/{org}/packages/{package_type}/{package_name}/versions/{package_version_id}"
    ],
    deletePackageVersionForUser: [
      "DELETE /users/{username}/packages/{package_type}/{package_name}/versions/{package_version_id}"
    ],
    getAllPackageVersionsForAPackageOwnedByAnOrg: [
      "GET /orgs/{org}/packages/{package_type}/{package_name}/versions",
      {},
      { renamed: ["packages", "getAllPackageVersionsForPackageOwnedByOrg"] }
    ],
    getAllPackageVersionsForAPackageOwnedByTheAuthenticatedUser: [
      "GET /user/packages/{package_type}/{package_name}/versions",
      {},
      {
        renamed: [
          "packages",
          "getAllPackageVersionsForPackageOwnedByAuthenticatedUser"
        ]
      }
    ],
    getAllPackageVersionsForPackageOwnedByAuthenticatedUser: [
      "GET /user/packages/{package_type}/{package_name}/versions"
    ],
    getAllPackageVersionsForPackageOwnedByOrg: [
      "GET /orgs/{org}/packages/{package_type}/{package_name}/versions"
    ],
    getAllPackageVersionsForPackageOwnedByUser: [
      "GET /users/{username}/packages/{package_type}/{package_name}/versions"
    ],
    getPackageForAuthenticatedUser: [
      "GET /user/packages/{package_type}/{package_name}"
    ],
    getPackageForOrganization: [
      "GET /orgs/{org}/packages/{package_type}/{package_name}"
    ],
    getPackageForUser: [
      "GET /users/{username}/packages/{package_type}/{package_name}"
    ],
    getPackageVersionForAuthenticatedUser: [
      "GET /user/packages/{package_type}/{package_name}/versions/{package_version_id}"
    ],
    getPackageVersionForOrganization: [
      "GET /orgs/{org}/packages/{package_type}/{package_name}/versions/{package_version_id}"
    ],
    getPackageVersionForUser: [
      "GET /users/{username}/packages/{package_type}/{package_name}/versions/{package_version_id}"
    ],
    listDockerMigrationConflictingPackagesForAuthenticatedUser: [
      "GET /user/docker/conflicts"
    ],
    listDockerMigrationConflictingPackagesForOrganization: [
      "GET /orgs/{org}/docker/conflicts"
    ],
    listDockerMigrationConflictingPackagesForUser: [
      "GET /users/{username}/docker/conflicts"
    ],
    listPackagesForAuthenticatedUser: ["GET /user/packages"],
    listPackagesForOrganization: ["GET /orgs/{org}/packages"],
    listPackagesForUser: ["GET /users/{username}/packages"],
    restorePackageForAuthenticatedUser: [
      "POST /user/packages/{package_type}/{package_name}/restore{?token}"
    ],
    restorePackageForOrg: [
      "POST /orgs/{org}/packages/{package_type}/{package_name}/restore{?token}"
    ],
    restorePackageForUser: [
      "POST /users/{username}/packages/{package_type}/{package_name}/restore{?token}"
    ],
    restorePackageVersionForAuthenticatedUser: [
      "POST /user/packages/{package_type}/{package_name}/versions/{package_version_id}/restore"
    ],
    restorePackageVersionForOrg: [
      "POST /orgs/{org}/packages/{package_type}/{package_name}/versions/{package_version_id}/restore"
    ],
    restorePackageVersionForUser: [
      "POST /users/{username}/packages/{package_type}/{package_name}/versions/{package_version_id}/restore"
    ]
  },
  privateRegistries: {
    createOrgPrivateRegistry: ["POST /orgs/{org}/private-registries"],
    deleteOrgPrivateRegistry: [
      "DELETE /orgs/{org}/private-registries/{secret_name}"
    ],
    getOrgPrivateRegistry: ["GET /orgs/{org}/private-registries/{secret_name}"],
    getOrgPublicKey: ["GET /orgs/{org}/private-registries/public-key"],
    listOrgPrivateRegistries: ["GET /orgs/{org}/private-registries"],
    updateOrgPrivateRegistry: [
      "PATCH /orgs/{org}/private-registries/{secret_name}"
    ]
  },
  pulls: {
    checkIfMerged: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/merge"],
    create: ["POST /repos/{owner}/{repo}/pulls"],
    createReplyForReviewComment: [
      "POST /repos/{owner}/{repo}/pulls/{pull_number}/comments/{comment_id}/replies"
    ],
    createReview: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews"],
    createReviewComment: [
      "POST /repos/{owner}/{repo}/pulls/{pull_number}/comments"
    ],
    deletePendingReview: [
      "DELETE /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"
    ],
    deleteReviewComment: [
      "DELETE /repos/{owner}/{repo}/pulls/comments/{comment_id}"
    ],
    dismissReview: [
      "PUT /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/dismissals"
    ],
    get: ["GET /repos/{owner}/{repo}/pulls/{pull_number}"],
    getReview: [
      "GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"
    ],
    getReviewComment: ["GET /repos/{owner}/{repo}/pulls/comments/{comment_id}"],
    list: ["GET /repos/{owner}/{repo}/pulls"],
    listCommentsForReview: [
      "GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/comments"
    ],
    listCommits: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/commits"],
    listFiles: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/files"],
    listRequestedReviewers: [
      "GET /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"
    ],
    listReviewComments: [
      "GET /repos/{owner}/{repo}/pulls/{pull_number}/comments"
    ],
    listReviewCommentsForRepo: ["GET /repos/{owner}/{repo}/pulls/comments"],
    listReviews: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews"],
    merge: ["PUT /repos/{owner}/{repo}/pulls/{pull_number}/merge"],
    removeRequestedReviewers: [
      "DELETE /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"
    ],
    requestReviewers: [
      "POST /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"
    ],
    submitReview: [
      "POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/events"
    ],
    update: ["PATCH /repos/{owner}/{repo}/pulls/{pull_number}"],
    updateBranch: [
      "PUT /repos/{owner}/{repo}/pulls/{pull_number}/update-branch"
    ],
    updateReview: [
      "PUT /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"
    ],
    updateReviewComment: [
      "PATCH /repos/{owner}/{repo}/pulls/comments/{comment_id}"
    ]
  },
  rateLimit: { get: ["GET /rate_limit"] },
  reactions: {
    createForCommitComment: [
      "POST /repos/{owner}/{repo}/comments/{comment_id}/reactions"
    ],
    createForIssue: [
      "POST /repos/{owner}/{repo}/issues/{issue_number}/reactions"
    ],
    createForIssueComment: [
      "POST /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions"
    ],
    createForPullRequestReviewComment: [
      "POST /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions"
    ],
    createForRelease: [
      "POST /repos/{owner}/{repo}/releases/{release_id}/reactions"
    ],
    createForTeamDiscussionCommentInOrg: [
      "POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions"
    ],
    createForTeamDiscussionInOrg: [
      "POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions"
    ],
    deleteForCommitComment: [
      "DELETE /repos/{owner}/{repo}/comments/{comment_id}/reactions/{reaction_id}"
    ],
    deleteForIssue: [
      "DELETE /repos/{owner}/{repo}/issues/{issue_number}/reactions/{reaction_id}"
    ],
    deleteForIssueComment: [
      "DELETE /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions/{reaction_id}"
    ],
    deleteForPullRequestComment: [
      "DELETE /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions/{reaction_id}"
    ],
    deleteForRelease: [
      "DELETE /repos/{owner}/{repo}/releases/{release_id}/reactions/{reaction_id}"
    ],
    deleteForTeamDiscussion: [
      "DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions/{reaction_id}"
    ],
    deleteForTeamDiscussionComment: [
      "DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions/{reaction_id}"
    ],
    listForCommitComment: [
      "GET /repos/{owner}/{repo}/comments/{comment_id}/reactions"
    ],
    listForIssue: ["GET /repos/{owner}/{repo}/issues/{issue_number}/reactions"],
    listForIssueComment: [
      "GET /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions"
    ],
    listForPullRequestReviewComment: [
      "GET /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions"
    ],
    listForRelease: [
      "GET /repos/{owner}/{repo}/releases/{release_id}/reactions"
    ],
    listForTeamDiscussionCommentInOrg: [
      "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions"
    ],
    listForTeamDiscussionInOrg: [
      "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions"
    ]
  },
  repos: {
    acceptInvitation: [
      "PATCH /user/repository_invitations/{invitation_id}",
      {},
      { renamed: ["repos", "acceptInvitationForAuthenticatedUser"] }
    ],
    acceptInvitationForAuthenticatedUser: [
      "PATCH /user/repository_invitations/{invitation_id}"
    ],
    addAppAccessRestrictions: [
      "POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps",
      {},
      { mapToData: "apps" }
    ],
    addCollaborator: ["PUT /repos/{owner}/{repo}/collaborators/{username}"],
    addStatusCheckContexts: [
      "POST /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts",
      {},
      { mapToData: "contexts" }
    ],
    addTeamAccessRestrictions: [
      "POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams",
      {},
      { mapToData: "teams" }
    ],
    addUserAccessRestrictions: [
      "POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users",
      {},
      { mapToData: "users" }
    ],
    cancelPagesDeployment: [
      "POST /repos/{owner}/{repo}/pages/deployments/{pages_deployment_id}/cancel"
    ],
    checkAutomatedSecurityFixes: [
      "GET /repos/{owner}/{repo}/automated-security-fixes"
    ],
    checkCollaborator: ["GET /repos/{owner}/{repo}/collaborators/{username}"],
    checkPrivateVulnerabilityReporting: [
      "GET /repos/{owner}/{repo}/private-vulnerability-reporting"
    ],
    checkVulnerabilityAlerts: [
      "GET /repos/{owner}/{repo}/vulnerability-alerts"
    ],
    codeownersErrors: ["GET /repos/{owner}/{repo}/codeowners/errors"],
    compareCommits: ["GET /repos/{owner}/{repo}/compare/{base}...{head}"],
    compareCommitsWithBasehead: [
      "GET /repos/{owner}/{repo}/compare/{basehead}"
    ],
    createAttestation: ["POST /repos/{owner}/{repo}/attestations"],
    createAutolink: ["POST /repos/{owner}/{repo}/autolinks"],
    createCommitComment: [
      "POST /repos/{owner}/{repo}/commits/{commit_sha}/comments"
    ],
    createCommitSignatureProtection: [
      "POST /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures"
    ],
    createCommitStatus: ["POST /repos/{owner}/{repo}/statuses/{sha}"],
    createDeployKey: ["POST /repos/{owner}/{repo}/keys"],
    createDeployment: ["POST /repos/{owner}/{repo}/deployments"],
    createDeploymentBranchPolicy: [
      "POST /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies"
    ],
    createDeploymentProtectionRule: [
      "POST /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules"
    ],
    createDeploymentStatus: [
      "POST /repos/{owner}/{repo}/deployments/{deployment_id}/statuses"
    ],
    createDispatchEvent: ["POST /repos/{owner}/{repo}/dispatches"],
    createForAuthenticatedUser: ["POST /user/repos"],
    createFork: ["POST /repos/{owner}/{repo}/forks"],
    createInOrg: ["POST /orgs/{org}/repos"],
    createOrUpdateCustomPropertiesValues: [
      "PATCH /repos/{owner}/{repo}/properties/values"
    ],
    createOrUpdateEnvironment: [
      "PUT /repos/{owner}/{repo}/environments/{environment_name}"
    ],
    createOrUpdateFileContents: ["PUT /repos/{owner}/{repo}/contents/{path}"],
    createOrgRuleset: ["POST /orgs/{org}/rulesets"],
    createPagesDeployment: ["POST /repos/{owner}/{repo}/pages/deployments"],
    createPagesSite: ["POST /repos/{owner}/{repo}/pages"],
    createRelease: ["POST /repos/{owner}/{repo}/releases"],
    createRepoRuleset: ["POST /repos/{owner}/{repo}/rulesets"],
    createUsingTemplate: [
      "POST /repos/{template_owner}/{template_repo}/generate"
    ],
    createWebhook: ["POST /repos/{owner}/{repo}/hooks"],
    declineInvitation: [
      "DELETE /user/repository_invitations/{invitation_id}",
      {},
      { renamed: ["repos", "declineInvitationForAuthenticatedUser"] }
    ],
    declineInvitationForAuthenticatedUser: [
      "DELETE /user/repository_invitations/{invitation_id}"
    ],
    delete: ["DELETE /repos/{owner}/{repo}"],
    deleteAccessRestrictions: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions"
    ],
    deleteAdminBranchProtection: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"
    ],
    deleteAnEnvironment: [
      "DELETE /repos/{owner}/{repo}/environments/{environment_name}"
    ],
    deleteAutolink: ["DELETE /repos/{owner}/{repo}/autolinks/{autolink_id}"],
    deleteBranchProtection: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection"
    ],
    deleteCommitComment: ["DELETE /repos/{owner}/{repo}/comments/{comment_id}"],
    deleteCommitSignatureProtection: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures"
    ],
    deleteDeployKey: ["DELETE /repos/{owner}/{repo}/keys/{key_id}"],
    deleteDeployment: [
      "DELETE /repos/{owner}/{repo}/deployments/{deployment_id}"
    ],
    deleteDeploymentBranchPolicy: [
      "DELETE /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies/{branch_policy_id}"
    ],
    deleteFile: ["DELETE /repos/{owner}/{repo}/contents/{path}"],
    deleteInvitation: [
      "DELETE /repos/{owner}/{repo}/invitations/{invitation_id}"
    ],
    deleteOrgRuleset: ["DELETE /orgs/{org}/rulesets/{ruleset_id}"],
    deletePagesSite: ["DELETE /repos/{owner}/{repo}/pages"],
    deletePullRequestReviewProtection: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"
    ],
    deleteRelease: ["DELETE /repos/{owner}/{repo}/releases/{release_id}"],
    deleteReleaseAsset: [
      "DELETE /repos/{owner}/{repo}/releases/assets/{asset_id}"
    ],
    deleteRepoRuleset: ["DELETE /repos/{owner}/{repo}/rulesets/{ruleset_id}"],
    deleteWebhook: ["DELETE /repos/{owner}/{repo}/hooks/{hook_id}"],
    disableAutomatedSecurityFixes: [
      "DELETE /repos/{owner}/{repo}/automated-security-fixes"
    ],
    disableDeploymentProtectionRule: [
      "DELETE /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules/{protection_rule_id}"
    ],
    disablePrivateVulnerabilityReporting: [
      "DELETE /repos/{owner}/{repo}/private-vulnerability-reporting"
    ],
    disableVulnerabilityAlerts: [
      "DELETE /repos/{owner}/{repo}/vulnerability-alerts"
    ],
    downloadArchive: [
      "GET /repos/{owner}/{repo}/zipball/{ref}",
      {},
      { renamed: ["repos", "downloadZipballArchive"] }
    ],
    downloadTarballArchive: ["GET /repos/{owner}/{repo}/tarball/{ref}"],
    downloadZipballArchive: ["GET /repos/{owner}/{repo}/zipball/{ref}"],
    enableAutomatedSecurityFixes: [
      "PUT /repos/{owner}/{repo}/automated-security-fixes"
    ],
    enablePrivateVulnerabilityReporting: [
      "PUT /repos/{owner}/{repo}/private-vulnerability-reporting"
    ],
    enableVulnerabilityAlerts: [
      "PUT /repos/{owner}/{repo}/vulnerability-alerts"
    ],
    generateReleaseNotes: [
      "POST /repos/{owner}/{repo}/releases/generate-notes"
    ],
    get: ["GET /repos/{owner}/{repo}"],
    getAccessRestrictions: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions"
    ],
    getAdminBranchProtection: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"
    ],
    getAllDeploymentProtectionRules: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules"
    ],
    getAllEnvironments: ["GET /repos/{owner}/{repo}/environments"],
    getAllStatusCheckContexts: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts"
    ],
    getAllTopics: ["GET /repos/{owner}/{repo}/topics"],
    getAppsWithAccessToProtectedBranch: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps"
    ],
    getAutolink: ["GET /repos/{owner}/{repo}/autolinks/{autolink_id}"],
    getBranch: ["GET /repos/{owner}/{repo}/branches/{branch}"],
    getBranchProtection: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection"
    ],
    getBranchRules: ["GET /repos/{owner}/{repo}/rules/branches/{branch}"],
    getClones: ["GET /repos/{owner}/{repo}/traffic/clones"],
    getCodeFrequencyStats: ["GET /repos/{owner}/{repo}/stats/code_frequency"],
    getCollaboratorPermissionLevel: [
      "GET /repos/{owner}/{repo}/collaborators/{username}/permission"
    ],
    getCombinedStatusForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/status"],
    getCommit: ["GET /repos/{owner}/{repo}/commits/{ref}"],
    getCommitActivityStats: ["GET /repos/{owner}/{repo}/stats/commit_activity"],
    getCommitComment: ["GET /repos/{owner}/{repo}/comments/{comment_id}"],
    getCommitSignatureProtection: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures"
    ],
    getCommunityProfileMetrics: ["GET /repos/{owner}/{repo}/community/profile"],
    getContent: ["GET /repos/{owner}/{repo}/contents/{path}"],
    getContributorsStats: ["GET /repos/{owner}/{repo}/stats/contributors"],
    getCustomDeploymentProtectionRule: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules/{protection_rule_id}"
    ],
    getCustomPropertiesValues: ["GET /repos/{owner}/{repo}/properties/values"],
    getDeployKey: ["GET /repos/{owner}/{repo}/keys/{key_id}"],
    getDeployment: ["GET /repos/{owner}/{repo}/deployments/{deployment_id}"],
    getDeploymentBranchPolicy: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies/{branch_policy_id}"
    ],
    getDeploymentStatus: [
      "GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses/{status_id}"
    ],
    getEnvironment: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}"
    ],
    getLatestPagesBuild: ["GET /repos/{owner}/{repo}/pages/builds/latest"],
    getLatestRelease: ["GET /repos/{owner}/{repo}/releases/latest"],
    getOrgRuleSuite: ["GET /orgs/{org}/rulesets/rule-suites/{rule_suite_id}"],
    getOrgRuleSuites: ["GET /orgs/{org}/rulesets/rule-suites"],
    getOrgRuleset: ["GET /orgs/{org}/rulesets/{ruleset_id}"],
    getOrgRulesets: ["GET /orgs/{org}/rulesets"],
    getPages: ["GET /repos/{owner}/{repo}/pages"],
    getPagesBuild: ["GET /repos/{owner}/{repo}/pages/builds/{build_id}"],
    getPagesDeployment: [
      "GET /repos/{owner}/{repo}/pages/deployments/{pages_deployment_id}"
    ],
    getPagesHealthCheck: ["GET /repos/{owner}/{repo}/pages/health"],
    getParticipationStats: ["GET /repos/{owner}/{repo}/stats/participation"],
    getPullRequestReviewProtection: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"
    ],
    getPunchCardStats: ["GET /repos/{owner}/{repo}/stats/punch_card"],
    getReadme: ["GET /repos/{owner}/{repo}/readme"],
    getReadmeInDirectory: ["GET /repos/{owner}/{repo}/readme/{dir}"],
    getRelease: ["GET /repos/{owner}/{repo}/releases/{release_id}"],
    getReleaseAsset: ["GET /repos/{owner}/{repo}/releases/assets/{asset_id}"],
    getReleaseByTag: ["GET /repos/{owner}/{repo}/releases/tags/{tag}"],
    getRepoRuleSuite: [
      "GET /repos/{owner}/{repo}/rulesets/rule-suites/{rule_suite_id}"
    ],
    getRepoRuleSuites: ["GET /repos/{owner}/{repo}/rulesets/rule-suites"],
    getRepoRuleset: ["GET /repos/{owner}/{repo}/rulesets/{ruleset_id}"],
    getRepoRulesetHistory: [
      "GET /repos/{owner}/{repo}/rulesets/{ruleset_id}/history"
    ],
    getRepoRulesetVersion: [
      "GET /repos/{owner}/{repo}/rulesets/{ruleset_id}/history/{version_id}"
    ],
    getRepoRulesets: ["GET /repos/{owner}/{repo}/rulesets"],
    getStatusChecksProtection: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"
    ],
    getTeamsWithAccessToProtectedBranch: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams"
    ],
    getTopPaths: ["GET /repos/{owner}/{repo}/traffic/popular/paths"],
    getTopReferrers: ["GET /repos/{owner}/{repo}/traffic/popular/referrers"],
    getUsersWithAccessToProtectedBranch: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users"
    ],
    getViews: ["GET /repos/{owner}/{repo}/traffic/views"],
    getWebhook: ["GET /repos/{owner}/{repo}/hooks/{hook_id}"],
    getWebhookConfigForRepo: [
      "GET /repos/{owner}/{repo}/hooks/{hook_id}/config"
    ],
    getWebhookDelivery: [
      "GET /repos/{owner}/{repo}/hooks/{hook_id}/deliveries/{delivery_id}"
    ],
    listActivities: ["GET /repos/{owner}/{repo}/activity"],
    listAttestations: [
      "GET /repos/{owner}/{repo}/attestations/{subject_digest}"
    ],
    listAutolinks: ["GET /repos/{owner}/{repo}/autolinks"],
    listBranches: ["GET /repos/{owner}/{repo}/branches"],
    listBranchesForHeadCommit: [
      "GET /repos/{owner}/{repo}/commits/{commit_sha}/branches-where-head"
    ],
    listCollaborators: ["GET /repos/{owner}/{repo}/collaborators"],
    listCommentsForCommit: [
      "GET /repos/{owner}/{repo}/commits/{commit_sha}/comments"
    ],
    listCommitCommentsForRepo: ["GET /repos/{owner}/{repo}/comments"],
    listCommitStatusesForRef: [
      "GET /repos/{owner}/{repo}/commits/{ref}/statuses"
    ],
    listCommits: ["GET /repos/{owner}/{repo}/commits"],
    listContributors: ["GET /repos/{owner}/{repo}/contributors"],
    listCustomDeploymentRuleIntegrations: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules/apps"
    ],
    listDeployKeys: ["GET /repos/{owner}/{repo}/keys"],
    listDeploymentBranchPolicies: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies"
    ],
    listDeploymentStatuses: [
      "GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses"
    ],
    listDeployments: ["GET /repos/{owner}/{repo}/deployments"],
    listForAuthenticatedUser: ["GET /user/repos"],
    listForOrg: ["GET /orgs/{org}/repos"],
    listForUser: ["GET /users/{username}/repos"],
    listForks: ["GET /repos/{owner}/{repo}/forks"],
    listInvitations: ["GET /repos/{owner}/{repo}/invitations"],
    listInvitationsForAuthenticatedUser: ["GET /user/repository_invitations"],
    listLanguages: ["GET /repos/{owner}/{repo}/languages"],
    listPagesBuilds: ["GET /repos/{owner}/{repo}/pages/builds"],
    listPublic: ["GET /repositories"],
    listPullRequestsAssociatedWithCommit: [
      "GET /repos/{owner}/{repo}/commits/{commit_sha}/pulls"
    ],
    listReleaseAssets: [
      "GET /repos/{owner}/{repo}/releases/{release_id}/assets"
    ],
    listReleases: ["GET /repos/{owner}/{repo}/releases"],
    listTags: ["GET /repos/{owner}/{repo}/tags"],
    listTeams: ["GET /repos/{owner}/{repo}/teams"],
    listWebhookDeliveries: [
      "GET /repos/{owner}/{repo}/hooks/{hook_id}/deliveries"
    ],
    listWebhooks: ["GET /repos/{owner}/{repo}/hooks"],
    merge: ["POST /repos/{owner}/{repo}/merges"],
    mergeUpstream: ["POST /repos/{owner}/{repo}/merge-upstream"],
    pingWebhook: ["POST /repos/{owner}/{repo}/hooks/{hook_id}/pings"],
    redeliverWebhookDelivery: [
      "POST /repos/{owner}/{repo}/hooks/{hook_id}/deliveries/{delivery_id}/attempts"
    ],
    removeAppAccessRestrictions: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps",
      {},
      { mapToData: "apps" }
    ],
    removeCollaborator: [
      "DELETE /repos/{owner}/{repo}/collaborators/{username}"
    ],
    removeStatusCheckContexts: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts",
      {},
      { mapToData: "contexts" }
    ],
    removeStatusCheckProtection: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"
    ],
    removeTeamAccessRestrictions: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams",
      {},
      { mapToData: "teams" }
    ],
    removeUserAccessRestrictions: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users",
      {},
      { mapToData: "users" }
    ],
    renameBranch: ["POST /repos/{owner}/{repo}/branches/{branch}/rename"],
    replaceAllTopics: ["PUT /repos/{owner}/{repo}/topics"],
    requestPagesBuild: ["POST /repos/{owner}/{repo}/pages/builds"],
    setAdminBranchProtection: [
      "POST /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"
    ],
    setAppAccessRestrictions: [
      "PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps",
      {},
      { mapToData: "apps" }
    ],
    setStatusCheckContexts: [
      "PUT /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts",
      {},
      { mapToData: "contexts" }
    ],
    setTeamAccessRestrictions: [
      "PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams",
      {},
      { mapToData: "teams" }
    ],
    setUserAccessRestrictions: [
      "PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users",
      {},
      { mapToData: "users" }
    ],
    testPushWebhook: ["POST /repos/{owner}/{repo}/hooks/{hook_id}/tests"],
    transfer: ["POST /repos/{owner}/{repo}/transfer"],
    update: ["PATCH /repos/{owner}/{repo}"],
    updateBranchProtection: [
      "PUT /repos/{owner}/{repo}/branches/{branch}/protection"
    ],
    updateCommitComment: ["PATCH /repos/{owner}/{repo}/comments/{comment_id}"],
    updateDeploymentBranchPolicy: [
      "PUT /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies/{branch_policy_id}"
    ],
    updateInformationAboutPagesSite: ["PUT /repos/{owner}/{repo}/pages"],
    updateInvitation: [
      "PATCH /repos/{owner}/{repo}/invitations/{invitation_id}"
    ],
    updateOrgRuleset: ["PUT /orgs/{org}/rulesets/{ruleset_id}"],
    updatePullRequestReviewProtection: [
      "PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"
    ],
    updateRelease: ["PATCH /repos/{owner}/{repo}/releases/{release_id}"],
    updateReleaseAsset: [
      "PATCH /repos/{owner}/{repo}/releases/assets/{asset_id}"
    ],
    updateRepoRuleset: ["PUT /repos/{owner}/{repo}/rulesets/{ruleset_id}"],
    updateStatusCheckPotection: [
      "PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks",
      {},
      { renamed: ["repos", "updateStatusCheckProtection"] }
    ],
    updateStatusCheckProtection: [
      "PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"
    ],
    updateWebhook: ["PATCH /repos/{owner}/{repo}/hooks/{hook_id}"],
    updateWebhookConfigForRepo: [
      "PATCH /repos/{owner}/{repo}/hooks/{hook_id}/config"
    ],
    uploadReleaseAsset: [
      "POST /repos/{owner}/{repo}/releases/{release_id}/assets{?name,label}",
      { baseUrl: "https://uploads.github.com" }
    ]
  },
  search: {
    code: ["GET /search/code"],
    commits: ["GET /search/commits"],
    issuesAndPullRequests: [
      "GET /search/issues",
      {},
      {
        deprecated: "octokit.rest.search.issuesAndPullRequests() is deprecated, see https://docs.github.com/rest/search/search#search-issues-and-pull-requests"
      }
    ],
    labels: ["GET /search/labels"],
    repos: ["GET /search/repositories"],
    topics: ["GET /search/topics"],
    users: ["GET /search/users"]
  },
  secretScanning: {
    createPushProtectionBypass: [
      "POST /repos/{owner}/{repo}/secret-scanning/push-protection-bypasses"
    ],
    getAlert: [
      "GET /repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}"
    ],
    getScanHistory: ["GET /repos/{owner}/{repo}/secret-scanning/scan-history"],
    listAlertsForEnterprise: [
      "GET /enterprises/{enterprise}/secret-scanning/alerts"
    ],
    listAlertsForOrg: ["GET /orgs/{org}/secret-scanning/alerts"],
    listAlertsForRepo: ["GET /repos/{owner}/{repo}/secret-scanning/alerts"],
    listLocationsForAlert: [
      "GET /repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}/locations"
    ],
    updateAlert: [
      "PATCH /repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}"
    ]
  },
  securityAdvisories: {
    createFork: [
      "POST /repos/{owner}/{repo}/security-advisories/{ghsa_id}/forks"
    ],
    createPrivateVulnerabilityReport: [
      "POST /repos/{owner}/{repo}/security-advisories/reports"
    ],
    createRepositoryAdvisory: [
      "POST /repos/{owner}/{repo}/security-advisories"
    ],
    createRepositoryAdvisoryCveRequest: [
      "POST /repos/{owner}/{repo}/security-advisories/{ghsa_id}/cve"
    ],
    getGlobalAdvisory: ["GET /advisories/{ghsa_id}"],
    getRepositoryAdvisory: [
      "GET /repos/{owner}/{repo}/security-advisories/{ghsa_id}"
    ],
    listGlobalAdvisories: ["GET /advisories"],
    listOrgRepositoryAdvisories: ["GET /orgs/{org}/security-advisories"],
    listRepositoryAdvisories: ["GET /repos/{owner}/{repo}/security-advisories"],
    updateRepositoryAdvisory: [
      "PATCH /repos/{owner}/{repo}/security-advisories/{ghsa_id}"
    ]
  },
  teams: {
    addOrUpdateMembershipForUserInOrg: [
      "PUT /orgs/{org}/teams/{team_slug}/memberships/{username}"
    ],
    addOrUpdateRepoPermissionsInOrg: [
      "PUT /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"
    ],
    checkPermissionsForRepoInOrg: [
      "GET /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"
    ],
    create: ["POST /orgs/{org}/teams"],
    createDiscussionCommentInOrg: [
      "POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments"
    ],
    createDiscussionInOrg: ["POST /orgs/{org}/teams/{team_slug}/discussions"],
    deleteDiscussionCommentInOrg: [
      "DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"
    ],
    deleteDiscussionInOrg: [
      "DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"
    ],
    deleteInOrg: ["DELETE /orgs/{org}/teams/{team_slug}"],
    getByName: ["GET /orgs/{org}/teams/{team_slug}"],
    getDiscussionCommentInOrg: [
      "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"
    ],
    getDiscussionInOrg: [
      "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"
    ],
    getMembershipForUserInOrg: [
      "GET /orgs/{org}/teams/{team_slug}/memberships/{username}"
    ],
    list: ["GET /orgs/{org}/teams"],
    listChildInOrg: ["GET /orgs/{org}/teams/{team_slug}/teams"],
    listDiscussionCommentsInOrg: [
      "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments"
    ],
    listDiscussionsInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions"],
    listForAuthenticatedUser: ["GET /user/teams"],
    listMembersInOrg: ["GET /orgs/{org}/teams/{team_slug}/members"],
    listPendingInvitationsInOrg: [
      "GET /orgs/{org}/teams/{team_slug}/invitations"
    ],
    listReposInOrg: ["GET /orgs/{org}/teams/{team_slug}/repos"],
    removeMembershipForUserInOrg: [
      "DELETE /orgs/{org}/teams/{team_slug}/memberships/{username}"
    ],
    removeRepoInOrg: [
      "DELETE /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"
    ],
    updateDiscussionCommentInOrg: [
      "PATCH /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"
    ],
    updateDiscussionInOrg: [
      "PATCH /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"
    ],
    updateInOrg: ["PATCH /orgs/{org}/teams/{team_slug}"]
  },
  users: {
    addEmailForAuthenticated: [
      "POST /user/emails",
      {},
      { renamed: ["users", "addEmailForAuthenticatedUser"] }
    ],
    addEmailForAuthenticatedUser: ["POST /user/emails"],
    addSocialAccountForAuthenticatedUser: ["POST /user/social_accounts"],
    block: ["PUT /user/blocks/{username}"],
    checkBlocked: ["GET /user/blocks/{username}"],
    checkFollowingForUser: ["GET /users/{username}/following/{target_user}"],
    checkPersonIsFollowedByAuthenticated: ["GET /user/following/{username}"],
    createGpgKeyForAuthenticated: [
      "POST /user/gpg_keys",
      {},
      { renamed: ["users", "createGpgKeyForAuthenticatedUser"] }
    ],
    createGpgKeyForAuthenticatedUser: ["POST /user/gpg_keys"],
    createPublicSshKeyForAuthenticated: [
      "POST /user/keys",
      {},
      { renamed: ["users", "createPublicSshKeyForAuthenticatedUser"] }
    ],
    createPublicSshKeyForAuthenticatedUser: ["POST /user/keys"],
    createSshSigningKeyForAuthenticatedUser: ["POST /user/ssh_signing_keys"],
    deleteEmailForAuthenticated: [
      "DELETE /user/emails",
      {},
      { renamed: ["users", "deleteEmailForAuthenticatedUser"] }
    ],
    deleteEmailForAuthenticatedUser: ["DELETE /user/emails"],
    deleteGpgKeyForAuthenticated: [
      "DELETE /user/gpg_keys/{gpg_key_id}",
      {},
      { renamed: ["users", "deleteGpgKeyForAuthenticatedUser"] }
    ],
    deleteGpgKeyForAuthenticatedUser: ["DELETE /user/gpg_keys/{gpg_key_id}"],
    deletePublicSshKeyForAuthenticated: [
      "DELETE /user/keys/{key_id}",
      {},
      { renamed: ["users", "deletePublicSshKeyForAuthenticatedUser"] }
    ],
    deletePublicSshKeyForAuthenticatedUser: ["DELETE /user/keys/{key_id}"],
    deleteSocialAccountForAuthenticatedUser: ["DELETE /user/social_accounts"],
    deleteSshSigningKeyForAuthenticatedUser: [
      "DELETE /user/ssh_signing_keys/{ssh_signing_key_id}"
    ],
    follow: ["PUT /user/following/{username}"],
    getAuthenticated: ["GET /user"],
    getById: ["GET /user/{account_id}"],
    getByUsername: ["GET /users/{username}"],
    getContextForUser: ["GET /users/{username}/hovercard"],
    getGpgKeyForAuthenticated: [
      "GET /user/gpg_keys/{gpg_key_id}",
      {},
      { renamed: ["users", "getGpgKeyForAuthenticatedUser"] }
    ],
    getGpgKeyForAuthenticatedUser: ["GET /user/gpg_keys/{gpg_key_id}"],
    getPublicSshKeyForAuthenticated: [
      "GET /user/keys/{key_id}",
      {},
      { renamed: ["users", "getPublicSshKeyForAuthenticatedUser"] }
    ],
    getPublicSshKeyForAuthenticatedUser: ["GET /user/keys/{key_id}"],
    getSshSigningKeyForAuthenticatedUser: [
      "GET /user/ssh_signing_keys/{ssh_signing_key_id}"
    ],
    list: ["GET /users"],
    listAttestations: ["GET /users/{username}/attestations/{subject_digest}"],
    listBlockedByAuthenticated: [
      "GET /user/blocks",
      {},
      { renamed: ["users", "listBlockedByAuthenticatedUser"] }
    ],
    listBlockedByAuthenticatedUser: ["GET /user/blocks"],
    listEmailsForAuthenticated: [
      "GET /user/emails",
      {},
      { renamed: ["users", "listEmailsForAuthenticatedUser"] }
    ],
    listEmailsForAuthenticatedUser: ["GET /user/emails"],
    listFollowedByAuthenticated: [
      "GET /user/following",
      {},
      { renamed: ["users", "listFollowedByAuthenticatedUser"] }
    ],
    listFollowedByAuthenticatedUser: ["GET /user/following"],
    listFollowersForAuthenticatedUser: ["GET /user/followers"],
    listFollowersForUser: ["GET /users/{username}/followers"],
    listFollowingForUser: ["GET /users/{username}/following"],
    listGpgKeysForAuthenticated: [
      "GET /user/gpg_keys",
      {},
      { renamed: ["users", "listGpgKeysForAuthenticatedUser"] }
    ],
    listGpgKeysForAuthenticatedUser: ["GET /user/gpg_keys"],
    listGpgKeysForUser: ["GET /users/{username}/gpg_keys"],
    listPublicEmailsForAuthenticated: [
      "GET /user/public_emails",
      {},
      { renamed: ["users", "listPublicEmailsForAuthenticatedUser"] }
    ],
    listPublicEmailsForAuthenticatedUser: ["GET /user/public_emails"],
    listPublicKeysForUser: ["GET /users/{username}/keys"],
    listPublicSshKeysForAuthenticated: [
      "GET /user/keys",
      {},
      { renamed: ["users", "listPublicSshKeysForAuthenticatedUser"] }
    ],
    listPublicSshKeysForAuthenticatedUser: ["GET /user/keys"],
    listSocialAccountsForAuthenticatedUser: ["GET /user/social_accounts"],
    listSocialAccountsForUser: ["GET /users/{username}/social_accounts"],
    listSshSigningKeysForAuthenticatedUser: ["GET /user/ssh_signing_keys"],
    listSshSigningKeysForUser: ["GET /users/{username}/ssh_signing_keys"],
    setPrimaryEmailVisibilityForAuthenticated: [
      "PATCH /user/email/visibility",
      {},
      { renamed: ["users", "setPrimaryEmailVisibilityForAuthenticatedUser"] }
    ],
    setPrimaryEmailVisibilityForAuthenticatedUser: [
      "PATCH /user/email/visibility"
    ],
    unblock: ["DELETE /user/blocks/{username}"],
    unfollow: ["DELETE /user/following/{username}"],
    updateAuthenticated: ["PATCH /user"]
  }
};
var endpoints_default = Endpoints;

// node_modules/@octokit/plugin-rest-endpoint-methods/dist-src/endpoints-to-methods.js
var endpointMethodsMap = /* @__PURE__ */ new Map();
for (const [scope, endpoints] of Object.entries(endpoints_default)) {
  for (const [methodName, endpoint2] of Object.entries(endpoints)) {
    const [route, defaults, decorations] = endpoint2;
    const [method, url] = route.split(/ /);
    const endpointDefaults = Object.assign(
      {
        method,
        url
      },
      defaults
    );
    if (!endpointMethodsMap.has(scope)) {
      endpointMethodsMap.set(scope, /* @__PURE__ */ new Map());
    }
    endpointMethodsMap.get(scope).set(methodName, {
      scope,
      methodName,
      endpointDefaults,
      decorations
    });
  }
}
var handler = {
  has({ scope }, methodName) {
    return endpointMethodsMap.get(scope).has(methodName);
  },
  getOwnPropertyDescriptor(target, methodName) {
    return {
      value: this.get(target, methodName),
      // ensures method is in the cache
      configurable: true,
      writable: true,
      enumerable: true
    };
  },
  defineProperty(target, methodName, descriptor) {
    Object.defineProperty(target.cache, methodName, descriptor);
    return true;
  },
  deleteProperty(target, methodName) {
    delete target.cache[methodName];
    return true;
  },
  ownKeys({ scope }) {
    return [...endpointMethodsMap.get(scope).keys()];
  },
  set(target, methodName, value) {
    return target.cache[methodName] = value;
  },
  get({ octokit: octokit2, scope, cache }, methodName) {
    if (cache[methodName]) {
      return cache[methodName];
    }
    const method = endpointMethodsMap.get(scope).get(methodName);
    if (!method) {
      return void 0;
    }
    const { endpointDefaults, decorations } = method;
    if (decorations) {
      cache[methodName] = decorate(
        octokit2,
        scope,
        methodName,
        endpointDefaults,
        decorations
      );
    } else {
      cache[methodName] = octokit2.request.defaults(endpointDefaults);
    }
    return cache[methodName];
  }
};
function endpointsToMethods(octokit2) {
  const newMethods = {};
  for (const scope of endpointMethodsMap.keys()) {
    newMethods[scope] = new Proxy({ octokit: octokit2, scope, cache: {} }, handler);
  }
  return newMethods;
}
function decorate(octokit2, scope, methodName, defaults, decorations) {
  const requestWithDefaults = octokit2.request.defaults(defaults);
  function withDecorations(...args) {
    let options = requestWithDefaults.endpoint.merge(...args);
    if (decorations.mapToData) {
      options = Object.assign({}, options, {
        data: options[decorations.mapToData],
        [decorations.mapToData]: void 0
      });
      return requestWithDefaults(options);
    }
    if (decorations.renamed) {
      const [newScope, newMethodName] = decorations.renamed;
      octokit2.log.warn(
        `octokit.${scope}.${methodName}() has been renamed to octokit.${newScope}.${newMethodName}()`
      );
    }
    if (decorations.deprecated) {
      octokit2.log.warn(decorations.deprecated);
    }
    if (decorations.renamedParameters) {
      const options2 = requestWithDefaults.endpoint.merge(...args);
      for (const [name, alias] of Object.entries(
        decorations.renamedParameters
      )) {
        if (name in options2) {
          octokit2.log.warn(
            `"${name}" parameter is deprecated for "octokit.${scope}.${methodName}()". Use "${alias}" instead`
          );
          if (!(alias in options2)) {
            options2[alias] = options2[name];
          }
          delete options2[name];
        }
      }
      return requestWithDefaults(options2);
    }
    return requestWithDefaults(...args);
  }
  return Object.assign(withDecorations, requestWithDefaults);
}

// node_modules/@octokit/plugin-rest-endpoint-methods/dist-src/index.js
function restEndpointMethods(octokit2) {
  const api = endpointsToMethods(octokit2);
  return {
    rest: api
  };
}
restEndpointMethods.VERSION = VERSION6;
function legacyRestEndpointMethods(octokit2) {
  const api = endpointsToMethods(octokit2);
  return {
    ...api,
    rest: api
  };
}
legacyRestEndpointMethods.VERSION = VERSION6;

// node_modules/@octokit/plugin-retry/dist-bundle/index.js
init_esm_shims();
var import_light = __toESM(require_light(), 1);
var VERSION7 = "0.0.0-development";
async function errorRequest(state, octokit2, error, options) {
  if (!error.request || !error.request.request) {
    throw error;
  }
  if (error.status >= 400 && !state.doNotRetry.includes(error.status)) {
    const retries = options.request.retries != null ? options.request.retries : state.retries;
    const retryAfter = Math.pow((options.request.retryCount || 0) + 1, 2);
    throw octokit2.retry.retryRequest(error, retries, retryAfter);
  }
  throw error;
}
async function wrapRequest(state, octokit2, request2, options) {
  const limiter = new import_light.default();
  limiter.on("failed", function(error, info) {
    const maxRetries = ~~error.request.request.retries;
    const after = ~~error.request.request.retryAfter;
    options.request.retryCount = info.retryCount + 1;
    if (maxRetries > info.retryCount) {
      return after * state.retryAfterBaseValue;
    }
  });
  return limiter.schedule(
    requestWithGraphqlErrorHandling.bind(null, state, octokit2, request2),
    options
  );
}
async function requestWithGraphqlErrorHandling(state, octokit2, request2, options) {
  const response = await request2(request2, options);
  if (response.data && response.data.errors && response.data.errors.length > 0 && /Something went wrong while executing your query/.test(
    response.data.errors[0].message
  )) {
    const error = new RequestError(response.data.errors[0].message, 500, {
      request: options,
      response
    });
    return errorRequest(state, octokit2, error, options);
  }
  return response;
}
function retry(octokit2, octokitOptions) {
  const state = Object.assign(
    {
      enabled: true,
      retryAfterBaseValue: 1e3,
      doNotRetry: [400, 401, 403, 404, 410, 422, 451],
      retries: 3
    },
    octokitOptions.retry
  );
  if (state.enabled) {
    octokit2.hook.error("request", errorRequest.bind(null, state, octokit2));
    octokit2.hook.wrap("request", wrapRequest.bind(null, state, octokit2));
  }
  return {
    retry: {
      retryRequest: (error, retries, retryAfter) => {
        error.request.request = Object.assign({}, error.request.request, {
          retries,
          retryAfter
        });
        return error;
      }
    }
  };
}
retry.VERSION = VERSION7;

// node_modules/@octokit/plugin-throttling/dist-bundle/index.js
init_esm_shims();
var import_light2 = __toESM(require_light(), 1);
var VERSION8 = "0.0.0-development";
var noop2 = () => Promise.resolve();
function wrapRequest2(state, request2, options) {
  return state.retryLimiter.schedule(doRequest, state, request2, options);
}
async function doRequest(state, request2, options) {
  const { pathname } = new URL(options.url, "http://github.test");
  const isAuth = isAuthRequest(options.method, pathname);
  const isWrite = !isAuth && options.method !== "GET" && options.method !== "HEAD";
  const isSearch = options.method === "GET" && pathname.startsWith("/search/");
  const isGraphQL = pathname.startsWith("/graphql");
  const retryCount = ~~request2.retryCount;
  const jobOptions = retryCount > 0 ? { priority: 0, weight: 0 } : {};
  if (state.clustering) {
    jobOptions.expiration = 1e3 * 60;
  }
  if (isWrite || isGraphQL) {
    await state.write.key(state.id).schedule(jobOptions, noop2);
  }
  if (isWrite && state.triggersNotification(pathname)) {
    await state.notifications.key(state.id).schedule(jobOptions, noop2);
  }
  if (isSearch) {
    await state.search.key(state.id).schedule(jobOptions, noop2);
  }
  const req = (isAuth ? state.auth : state.global).key(state.id).schedule(jobOptions, request2, options);
  if (isGraphQL) {
    const res = await req;
    if (res.data.errors != null && res.data.errors.some((error) => error.type === "RATE_LIMITED")) {
      const error = Object.assign(new Error("GraphQL Rate Limit Exceeded"), {
        response: res,
        data: res.data
      });
      throw error;
    }
  }
  return req;
}
function isAuthRequest(method, pathname) {
  return method === "PATCH" && // https://docs.github.com/en/rest/apps/apps?apiVersion=2022-11-28#create-a-scoped-access-token
  /^\/applications\/[^/]+\/token\/scoped$/.test(pathname) || method === "POST" && // https://docs.github.com/en/rest/apps/oauth-applications?apiVersion=2022-11-28#reset-a-token
  (/^\/applications\/[^/]+\/token$/.test(pathname) || // https://docs.github.com/en/rest/apps/apps?apiVersion=2022-11-28#create-an-installation-access-token-for-an-app
  /^\/app\/installations\/[^/]+\/access_tokens$/.test(pathname) || // https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps
  pathname === "/login/oauth/access_token");
}
var triggers_notification_paths_default = [
  "/orgs/{org}/invitations",
  "/orgs/{org}/invitations/{invitation_id}",
  "/orgs/{org}/teams/{team_slug}/discussions",
  "/orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments",
  "/repos/{owner}/{repo}/collaborators/{username}",
  "/repos/{owner}/{repo}/commits/{commit_sha}/comments",
  "/repos/{owner}/{repo}/issues",
  "/repos/{owner}/{repo}/issues/{issue_number}/comments",
  "/repos/{owner}/{repo}/issues/{issue_number}/sub_issue",
  "/repos/{owner}/{repo}/issues/{issue_number}/sub_issues/priority",
  "/repos/{owner}/{repo}/pulls",
  "/repos/{owner}/{repo}/pulls/{pull_number}/comments",
  "/repos/{owner}/{repo}/pulls/{pull_number}/comments/{comment_id}/replies",
  "/repos/{owner}/{repo}/pulls/{pull_number}/merge",
  "/repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers",
  "/repos/{owner}/{repo}/pulls/{pull_number}/reviews",
  "/repos/{owner}/{repo}/releases",
  "/teams/{team_id}/discussions",
  "/teams/{team_id}/discussions/{discussion_number}/comments"
];
function routeMatcher(paths) {
  const regexes = paths.map(
    (path33) => path33.split("/").map((c) => c.startsWith("{") ? "(?:.+?)" : c).join("/")
  );
  const regex2 = `^(?:${regexes.map((r) => `(?:${r})`).join("|")})[^/]*$`;
  return new RegExp(regex2, "i");
}
var regex = routeMatcher(triggers_notification_paths_default);
var triggersNotification = regex.test.bind(regex);
var groups = {};
var createGroups = function(Bottleneck2, common) {
  groups.global = new Bottleneck2.Group({
    id: "octokit-global",
    maxConcurrent: 10,
    ...common
  });
  groups.auth = new Bottleneck2.Group({
    id: "octokit-auth",
    maxConcurrent: 1,
    ...common
  });
  groups.search = new Bottleneck2.Group({
    id: "octokit-search",
    maxConcurrent: 1,
    minTime: 2e3,
    ...common
  });
  groups.write = new Bottleneck2.Group({
    id: "octokit-write",
    maxConcurrent: 1,
    minTime: 1e3,
    ...common
  });
  groups.notifications = new Bottleneck2.Group({
    id: "octokit-notifications",
    maxConcurrent: 1,
    minTime: 3e3,
    ...common
  });
};
function throttling(octokit2, octokitOptions) {
  const {
    enabled = true,
    Bottleneck: Bottleneck2 = import_light2.default,
    id = "no-id",
    timeout = 1e3 * 60 * 2,
    // Redis TTL: 2 minutes
    connection
  } = octokitOptions.throttle || {};
  if (!enabled) {
    return {};
  }
  const common = { timeout };
  if (typeof connection !== "undefined") {
    common.connection = connection;
  }
  if (groups.global == null) {
    createGroups(Bottleneck2, common);
  }
  const state = Object.assign(
    {
      clustering: connection != null,
      triggersNotification,
      fallbackSecondaryRateRetryAfter: 60,
      retryAfterBaseValue: 1e3,
      retryLimiter: new Bottleneck2(),
      id,
      ...groups
    },
    octokitOptions.throttle
  );
  if (typeof state.onSecondaryRateLimit !== "function" || typeof state.onRateLimit !== "function") {
    throw new Error(`octokit/plugin-throttling error:
        You must pass the onSecondaryRateLimit and onRateLimit error handlers.
        See https://octokit.github.io/rest.js/#throttling

        const octokit = new Octokit({
          throttle: {
            onSecondaryRateLimit: (retryAfter, options) => {/* ... */},
            onRateLimit: (retryAfter, options) => {/* ... */}
          }
        })
    `);
  }
  const events = {};
  const emitter = new Bottleneck2.Events(events);
  events.on("secondary-limit", state.onSecondaryRateLimit);
  events.on("rate-limit", state.onRateLimit);
  events.on(
    "error",
    (e) => octokit2.log.warn("Error in throttling-plugin limit handler", e)
  );
  state.retryLimiter.on("failed", async function(error, info) {
    const [state2, request2, options] = info.args;
    const { pathname } = new URL(options.url, "http://github.test");
    const shouldRetryGraphQL = pathname.startsWith("/graphql") && error.status !== 401;
    if (!(shouldRetryGraphQL || error.status === 403 || error.status === 429)) {
      return;
    }
    const retryCount = ~~request2.retryCount;
    request2.retryCount = retryCount;
    options.request.retryCount = retryCount;
    const { wantRetry, retryAfter = 0 } = await (async function() {
      if (/\bsecondary rate\b/i.test(error.message)) {
        const retryAfter2 = Number(error.response.headers["retry-after"]) || state2.fallbackSecondaryRateRetryAfter;
        const wantRetry2 = await emitter.trigger(
          "secondary-limit",
          retryAfter2,
          options,
          octokit2,
          retryCount
        );
        return { wantRetry: wantRetry2, retryAfter: retryAfter2 };
      }
      if (error.response.headers != null && error.response.headers["x-ratelimit-remaining"] === "0" || (error.response.data?.errors ?? []).some(
        (error2) => error2.type === "RATE_LIMITED"
      )) {
        const rateLimitReset = new Date(
          ~~error.response.headers["x-ratelimit-reset"] * 1e3
        ).getTime();
        const retryAfter2 = Math.max(
          // Add one second so we retry _after_ the reset time
          // https://docs.github.com/en/rest/overview/resources-in-the-rest-api?apiVersion=2022-11-28#exceeding-the-rate-limit
          Math.ceil((rateLimitReset - Date.now()) / 1e3) + 1,
          0
        );
        const wantRetry2 = await emitter.trigger(
          "rate-limit",
          retryAfter2,
          options,
          octokit2,
          retryCount
        );
        return { wantRetry: wantRetry2, retryAfter: retryAfter2 };
      }
      return {};
    })();
    if (wantRetry) {
      request2.retryCount++;
      return retryAfter * state2.retryAfterBaseValue;
    }
  });
  octokit2.hook.wrap("request", wrapRequest2.bind(null, state));
  return {};
}
throttling.VERSION = VERSION8;
throttling.triggersNotification = triggersNotification;

// node_modules/@octokit/app/dist-node/index.js
init_esm_shims();

// node_modules/@octokit/auth-app/dist-node/index.js
init_esm_shims();

// node_modules/@octokit/auth-oauth-app/dist-bundle/index.js
init_esm_shims();

// node_modules/@octokit/auth-oauth-user/dist-bundle/index.js
init_esm_shims();

// node_modules/@octokit/auth-oauth-device/dist-bundle/index.js
init_esm_shims();

// node_modules/@octokit/oauth-methods/dist-bundle/index.js
init_esm_shims();

// node_modules/@octokit/oauth-authorization-url/dist-src/index.js
init_esm_shims();
function oauthAuthorizationUrl(options) {
  const clientType = options.clientType || "oauth-app";
  const baseUrl = options.baseUrl || "https://github.com";
  const result = {
    clientType,
    allowSignup: options.allowSignup === false ? false : true,
    clientId: options.clientId,
    login: options.login || null,
    redirectUrl: options.redirectUrl || null,
    state: options.state || Math.random().toString(36).substr(2),
    url: ""
  };
  if (clientType === "oauth-app") {
    const scopes = "scopes" in options ? options.scopes : [];
    result.scopes = typeof scopes === "string" ? scopes.split(/[,\s]+/).filter(Boolean) : scopes;
  }
  result.url = urlBuilderAuthorize(`${baseUrl}/login/oauth/authorize`, result);
  return result;
}
function urlBuilderAuthorize(base, options) {
  const map = {
    allowSignup: "allow_signup",
    clientId: "client_id",
    login: "login",
    redirectUrl: "redirect_uri",
    scopes: "scope",
    state: "state"
  };
  let url = base;
  Object.keys(map).filter((k) => options[k] !== null).filter((k) => {
    if (k !== "scopes")
      return true;
    if (options.clientType === "github-app")
      return false;
    return !Array.isArray(options[k]) || options[k].length > 0;
  }).map((key) => [map[key], `${options[key]}`]).forEach(([key, value], index) => {
    url += index === 0 ? `?` : "&";
    url += `${key}=${encodeURIComponent(value)}`;
  });
  return url;
}

// node_modules/@octokit/oauth-methods/dist-bundle/index.js
function requestToOAuthBaseUrl(request2) {
  const endpointDefaults = request2.endpoint.DEFAULTS;
  return /^https:\/\/(api\.)?github\.com$/.test(endpointDefaults.baseUrl) ? "https://github.com" : endpointDefaults.baseUrl.replace("/api/v3", "");
}
async function oauthRequest(request2, route, parameters) {
  const withOAuthParameters = {
    baseUrl: requestToOAuthBaseUrl(request2),
    headers: {
      accept: "application/json"
    },
    ...parameters
  };
  const response = await request2(route, withOAuthParameters);
  if ("error" in response.data) {
    const error = new RequestError(
      `${response.data.error_description} (${response.data.error}, ${response.data.error_uri})`,
      400,
      {
        request: request2.endpoint.merge(
          route,
          withOAuthParameters
        )
      }
    );
    error.response = response;
    throw error;
  }
  return response;
}
function getWebFlowAuthorizationUrl({
  request: request2 = request,
  ...options
}) {
  const baseUrl = requestToOAuthBaseUrl(request2);
  return oauthAuthorizationUrl({
    ...options,
    baseUrl
  });
}
async function exchangeWebFlowCode(options) {
  const request2 = options.request || request;
  const response = await oauthRequest(
    request2,
    "POST /login/oauth/access_token",
    {
      client_id: options.clientId,
      client_secret: options.clientSecret,
      code: options.code,
      redirect_uri: options.redirectUrl
    }
  );
  const authentication = {
    clientType: options.clientType,
    clientId: options.clientId,
    clientSecret: options.clientSecret,
    token: response.data.access_token,
    scopes: response.data.scope.split(/\s+/).filter(Boolean)
  };
  if (options.clientType === "github-app") {
    if ("refresh_token" in response.data) {
      const apiTimeInMs = new Date(response.headers.date).getTime();
      authentication.refreshToken = response.data.refresh_token, authentication.expiresAt = toTimestamp(
        apiTimeInMs,
        response.data.expires_in
      ), authentication.refreshTokenExpiresAt = toTimestamp(
        apiTimeInMs,
        response.data.refresh_token_expires_in
      );
    }
    delete authentication.scopes;
  }
  return { ...response, authentication };
}
function toTimestamp(apiTimeInMs, expirationInSeconds) {
  return new Date(apiTimeInMs + expirationInSeconds * 1e3).toISOString();
}
async function createDeviceCode(options) {
  const request2 = options.request || request;
  const parameters = {
    client_id: options.clientId
  };
  if ("scopes" in options && Array.isArray(options.scopes)) {
    parameters.scope = options.scopes.join(" ");
  }
  return oauthRequest(request2, "POST /login/device/code", parameters);
}
async function exchangeDeviceCode(options) {
  const request2 = options.request || request;
  const response = await oauthRequest(
    request2,
    "POST /login/oauth/access_token",
    {
      client_id: options.clientId,
      device_code: options.code,
      grant_type: "urn:ietf:params:oauth:grant-type:device_code"
    }
  );
  const authentication = {
    clientType: options.clientType,
    clientId: options.clientId,
    token: response.data.access_token,
    scopes: response.data.scope.split(/\s+/).filter(Boolean)
  };
  if ("clientSecret" in options) {
    authentication.clientSecret = options.clientSecret;
  }
  if (options.clientType === "github-app") {
    if ("refresh_token" in response.data) {
      const apiTimeInMs = new Date(response.headers.date).getTime();
      authentication.refreshToken = response.data.refresh_token, authentication.expiresAt = toTimestamp2(
        apiTimeInMs,
        response.data.expires_in
      ), authentication.refreshTokenExpiresAt = toTimestamp2(
        apiTimeInMs,
        response.data.refresh_token_expires_in
      );
    }
    delete authentication.scopes;
  }
  return { ...response, authentication };
}
function toTimestamp2(apiTimeInMs, expirationInSeconds) {
  return new Date(apiTimeInMs + expirationInSeconds * 1e3).toISOString();
}
async function checkToken(options) {
  const request2 = options.request || request;
  const response = await request2("POST /applications/{client_id}/token", {
    headers: {
      authorization: `basic ${btoa(
        `${options.clientId}:${options.clientSecret}`
      )}`
    },
    client_id: options.clientId,
    access_token: options.token
  });
  const authentication = {
    clientType: options.clientType,
    clientId: options.clientId,
    clientSecret: options.clientSecret,
    token: options.token,
    scopes: response.data.scopes
  };
  if (response.data.expires_at)
    authentication.expiresAt = response.data.expires_at;
  if (options.clientType === "github-app") {
    delete authentication.scopes;
  }
  return { ...response, authentication };
}
async function refreshToken(options) {
  const request2 = options.request || request;
  const response = await oauthRequest(
    request2,
    "POST /login/oauth/access_token",
    {
      client_id: options.clientId,
      client_secret: options.clientSecret,
      grant_type: "refresh_token",
      refresh_token: options.refreshToken
    }
  );
  const apiTimeInMs = new Date(response.headers.date).getTime();
  const authentication = {
    clientType: "github-app",
    clientId: options.clientId,
    clientSecret: options.clientSecret,
    token: response.data.access_token,
    refreshToken: response.data.refresh_token,
    expiresAt: toTimestamp3(apiTimeInMs, response.data.expires_in),
    refreshTokenExpiresAt: toTimestamp3(
      apiTimeInMs,
      response.data.refresh_token_expires_in
    )
  };
  return { ...response, authentication };
}
function toTimestamp3(apiTimeInMs, expirationInSeconds) {
  return new Date(apiTimeInMs + expirationInSeconds * 1e3).toISOString();
}
async function scopeToken(options) {
  const {
    request: optionsRequest,
    clientType,
    clientId,
    clientSecret,
    token,
    ...requestOptions
  } = options;
  const request2 = options.request || request;
  const response = await request2(
    "POST /applications/{client_id}/token/scoped",
    {
      headers: {
        authorization: `basic ${btoa(`${clientId}:${clientSecret}`)}`
      },
      client_id: clientId,
      access_token: token,
      ...requestOptions
    }
  );
  const authentication = Object.assign(
    {
      clientType,
      clientId,
      clientSecret,
      token: response.data.token
    },
    response.data.expires_at ? { expiresAt: response.data.expires_at } : {}
  );
  return { ...response, authentication };
}
async function resetToken(options) {
  const request2 = options.request || request;
  const auth7 = btoa(`${options.clientId}:${options.clientSecret}`);
  const response = await request2(
    "PATCH /applications/{client_id}/token",
    {
      headers: {
        authorization: `basic ${auth7}`
      },
      client_id: options.clientId,
      access_token: options.token
    }
  );
  const authentication = {
    clientType: options.clientType,
    clientId: options.clientId,
    clientSecret: options.clientSecret,
    token: response.data.token,
    scopes: response.data.scopes
  };
  if (response.data.expires_at)
    authentication.expiresAt = response.data.expires_at;
  if (options.clientType === "github-app") {
    delete authentication.scopes;
  }
  return { ...response, authentication };
}
async function deleteToken(options) {
  const request2 = options.request || request;
  const auth7 = btoa(`${options.clientId}:${options.clientSecret}`);
  return request2(
    "DELETE /applications/{client_id}/token",
    {
      headers: {
        authorization: `basic ${auth7}`
      },
      client_id: options.clientId,
      access_token: options.token
    }
  );
}
async function deleteAuthorization(options) {
  const request2 = options.request || request;
  const auth7 = btoa(`${options.clientId}:${options.clientSecret}`);
  return request2(
    "DELETE /applications/{client_id}/grant",
    {
      headers: {
        authorization: `basic ${auth7}`
      },
      client_id: options.clientId,
      access_token: options.token
    }
  );
}

// node_modules/@octokit/auth-oauth-device/dist-bundle/index.js
async function getOAuthAccessToken(state, options) {
  const cachedAuthentication = getCachedAuthentication(state, options.auth);
  if (cachedAuthentication) return cachedAuthentication;
  const { data: verification } = await createDeviceCode({
    clientType: state.clientType,
    clientId: state.clientId,
    request: options.request || state.request,
    // @ts-expect-error the extra code to make TS happy is not worth it
    scopes: options.auth.scopes || state.scopes
  });
  await state.onVerification(verification);
  const authentication = await waitForAccessToken(
    options.request || state.request,
    state.clientId,
    state.clientType,
    verification
  );
  state.authentication = authentication;
  return authentication;
}
function getCachedAuthentication(state, auth22) {
  if (auth22.refresh === true) return false;
  if (!state.authentication) return false;
  if (state.clientType === "github-app") {
    return state.authentication;
  }
  const authentication = state.authentication;
  const newScope = ("scopes" in auth22 && auth22.scopes || state.scopes).join(
    " "
  );
  const currentScope = authentication.scopes.join(" ");
  return newScope === currentScope ? authentication : false;
}
async function wait(seconds) {
  await new Promise((resolve2) => setTimeout(resolve2, seconds * 1e3));
}
async function waitForAccessToken(request2, clientId, clientType, verification) {
  try {
    const options = {
      clientId,
      request: request2,
      code: verification.device_code
    };
    const { authentication } = clientType === "oauth-app" ? await exchangeDeviceCode({
      ...options,
      clientType: "oauth-app"
    }) : await exchangeDeviceCode({
      ...options,
      clientType: "github-app"
    });
    return {
      type: "token",
      tokenType: "oauth",
      ...authentication
    };
  } catch (error) {
    if (!error.response) throw error;
    const errorType = error.response.data.error;
    if (errorType === "authorization_pending") {
      await wait(verification.interval);
      return waitForAccessToken(request2, clientId, clientType, verification);
    }
    if (errorType === "slow_down") {
      await wait(verification.interval + 7);
      return waitForAccessToken(request2, clientId, clientType, verification);
    }
    throw error;
  }
}
async function auth2(state, authOptions) {
  return getOAuthAccessToken(state, {
    auth: authOptions
  });
}
async function hook2(state, request2, route, parameters) {
  let endpoint2 = request2.endpoint.merge(
    route,
    parameters
  );
  if (/\/login\/(oauth\/access_token|device\/code)$/.test(endpoint2.url)) {
    return request2(endpoint2);
  }
  const { token } = await getOAuthAccessToken(state, {
    request: request2,
    auth: { type: "oauth" }
  });
  endpoint2.headers.authorization = `token ${token}`;
  return request2(endpoint2);
}
var VERSION9 = "0.0.0-development";
function createOAuthDeviceAuth(options) {
  const requestWithDefaults = options.request || request.defaults({
    headers: {
      "user-agent": `octokit-auth-oauth-device.js/${VERSION9} ${getUserAgent()}`
    }
  });
  const { request: request2 = requestWithDefaults, ...otherOptions } = options;
  const state = options.clientType === "github-app" ? {
    ...otherOptions,
    clientType: "github-app",
    request: request2
  } : {
    ...otherOptions,
    clientType: "oauth-app",
    request: request2,
    scopes: options.scopes || []
  };
  if (!options.clientId) {
    throw new Error(
      '[@octokit/auth-oauth-device] "clientId" option must be set (https://github.com/octokit/auth-oauth-device.js#usage)'
    );
  }
  if (!options.onVerification) {
    throw new Error(
      '[@octokit/auth-oauth-device] "onVerification" option must be a function (https://github.com/octokit/auth-oauth-device.js#usage)'
    );
  }
  return Object.assign(auth2.bind(null, state), {
    hook: hook2.bind(null, state)
  });
}

// node_modules/@octokit/auth-oauth-user/dist-bundle/index.js
var VERSION10 = "0.0.0-development";
async function getAuthentication(state) {
  if ("code" in state.strategyOptions) {
    const { authentication } = await exchangeWebFlowCode({
      clientId: state.clientId,
      clientSecret: state.clientSecret,
      clientType: state.clientType,
      onTokenCreated: state.onTokenCreated,
      ...state.strategyOptions,
      request: state.request
    });
    return {
      type: "token",
      tokenType: "oauth",
      ...authentication
    };
  }
  if ("onVerification" in state.strategyOptions) {
    const deviceAuth = createOAuthDeviceAuth({
      clientType: state.clientType,
      clientId: state.clientId,
      onTokenCreated: state.onTokenCreated,
      ...state.strategyOptions,
      request: state.request
    });
    const authentication = await deviceAuth({
      type: "oauth"
    });
    return {
      clientSecret: state.clientSecret,
      ...authentication
    };
  }
  if ("token" in state.strategyOptions) {
    return {
      type: "token",
      tokenType: "oauth",
      clientId: state.clientId,
      clientSecret: state.clientSecret,
      clientType: state.clientType,
      onTokenCreated: state.onTokenCreated,
      ...state.strategyOptions
    };
  }
  throw new Error("[@octokit/auth-oauth-user] Invalid strategy options");
}
async function auth3(state, options = {}) {
  if (!state.authentication) {
    state.authentication = state.clientType === "oauth-app" ? await getAuthentication(state) : await getAuthentication(state);
  }
  if (state.authentication.invalid) {
    throw new Error("[@octokit/auth-oauth-user] Token is invalid");
  }
  const currentAuthentication = state.authentication;
  if ("expiresAt" in currentAuthentication) {
    if (options.type === "refresh" || new Date(currentAuthentication.expiresAt) < /* @__PURE__ */ new Date()) {
      const { authentication } = await refreshToken({
        clientType: "github-app",
        clientId: state.clientId,
        clientSecret: state.clientSecret,
        refreshToken: currentAuthentication.refreshToken,
        request: state.request
      });
      state.authentication = {
        tokenType: "oauth",
        type: "token",
        ...authentication
      };
    }
  }
  if (options.type === "refresh") {
    if (state.clientType === "oauth-app") {
      throw new Error(
        "[@octokit/auth-oauth-user] OAuth Apps do not support expiring tokens"
      );
    }
    if (!currentAuthentication.hasOwnProperty("expiresAt")) {
      throw new Error("[@octokit/auth-oauth-user] Refresh token missing");
    }
    await state.onTokenCreated?.(state.authentication, {
      type: options.type
    });
  }
  if (options.type === "check" || options.type === "reset") {
    const method = options.type === "check" ? checkToken : resetToken;
    try {
      const { authentication } = await method({
        // @ts-expect-error making TS happy would require unnecessary code so no
        clientType: state.clientType,
        clientId: state.clientId,
        clientSecret: state.clientSecret,
        token: state.authentication.token,
        request: state.request
      });
      state.authentication = {
        tokenType: "oauth",
        type: "token",
        // @ts-expect-error TBD
        ...authentication
      };
      if (options.type === "reset") {
        await state.onTokenCreated?.(state.authentication, {
          type: options.type
        });
      }
      return state.authentication;
    } catch (error) {
      if (error.status === 404) {
        error.message = "[@octokit/auth-oauth-user] Token is invalid";
        state.authentication.invalid = true;
      }
      throw error;
    }
  }
  if (options.type === "delete" || options.type === "deleteAuthorization") {
    const method = options.type === "delete" ? deleteToken : deleteAuthorization;
    try {
      await method({
        // @ts-expect-error making TS happy would require unnecessary code so no
        clientType: state.clientType,
        clientId: state.clientId,
        clientSecret: state.clientSecret,
        token: state.authentication.token,
        request: state.request
      });
    } catch (error) {
      if (error.status !== 404) throw error;
    }
    state.authentication.invalid = true;
    return state.authentication;
  }
  return state.authentication;
}
var ROUTES_REQUIRING_BASIC_AUTH = /\/applications\/[^/]+\/(token|grant)s?/;
function requiresBasicAuth(url) {
  return url && ROUTES_REQUIRING_BASIC_AUTH.test(url);
}
async function hook3(state, request2, route, parameters = {}) {
  const endpoint2 = request2.endpoint.merge(
    route,
    parameters
  );
  if (/\/login\/(oauth\/access_token|device\/code)$/.test(endpoint2.url)) {
    return request2(endpoint2);
  }
  if (requiresBasicAuth(endpoint2.url)) {
    const credentials = btoa(`${state.clientId}:${state.clientSecret}`);
    endpoint2.headers.authorization = `basic ${credentials}`;
    return request2(endpoint2);
  }
  const { token } = state.clientType === "oauth-app" ? await auth3({ ...state, request: request2 }) : await auth3({ ...state, request: request2 });
  endpoint2.headers.authorization = "token " + token;
  return request2(endpoint2);
}
function createOAuthUserAuth({
  clientId,
  clientSecret,
  clientType = "oauth-app",
  request: request2 = request.defaults({
    headers: {
      "user-agent": `octokit-auth-oauth-app.js/${VERSION10} ${getUserAgent()}`
    }
  }),
  onTokenCreated,
  ...strategyOptions
}) {
  const state = Object.assign({
    clientType,
    clientId,
    clientSecret,
    onTokenCreated,
    strategyOptions,
    request: request2
  });
  return Object.assign(auth3.bind(null, state), {
    // @ts-expect-error not worth the extra code needed to appease TS
    hook: hook3.bind(null, state)
  });
}
createOAuthUserAuth.VERSION = VERSION10;

// node_modules/@octokit/auth-oauth-app/dist-bundle/index.js
async function auth4(state, authOptions) {
  if (authOptions.type === "oauth-app") {
    return {
      type: "oauth-app",
      clientId: state.clientId,
      clientSecret: state.clientSecret,
      clientType: state.clientType,
      headers: {
        authorization: `basic ${btoa(
          `${state.clientId}:${state.clientSecret}`
        )}`
      }
    };
  }
  if ("factory" in authOptions) {
    const { type, ...options } = {
      ...authOptions,
      ...state
    };
    return authOptions.factory(options);
  }
  const common = {
    clientId: state.clientId,
    clientSecret: state.clientSecret,
    request: state.request,
    ...authOptions
  };
  const userAuth = state.clientType === "oauth-app" ? await createOAuthUserAuth({
    ...common,
    clientType: state.clientType
  }) : await createOAuthUserAuth({
    ...common,
    clientType: state.clientType
  });
  return userAuth();
}
async function hook4(state, request2, route, parameters) {
  let endpoint2 = request2.endpoint.merge(
    route,
    parameters
  );
  if (/\/login\/(oauth\/access_token|device\/code)$/.test(endpoint2.url)) {
    return request2(endpoint2);
  }
  if (state.clientType === "github-app" && !requiresBasicAuth(endpoint2.url)) {
    throw new Error(
      `[@octokit/auth-oauth-app] GitHub Apps cannot use their client ID/secret for basic authentication for endpoints other than "/applications/{client_id}/**". "${endpoint2.method} ${endpoint2.url}" is not supported.`
    );
  }
  const credentials = btoa(`${state.clientId}:${state.clientSecret}`);
  endpoint2.headers.authorization = `basic ${credentials}`;
  try {
    return await request2(endpoint2);
  } catch (error) {
    if (error.status !== 401) throw error;
    error.message = `[@octokit/auth-oauth-app] "${endpoint2.method} ${endpoint2.url}" does not support clientId/clientSecret basic authentication.`;
    throw error;
  }
}
var VERSION11 = "0.0.0-development";
function createOAuthAppAuth(options) {
  const state = Object.assign(
    {
      request: request.defaults({
        headers: {
          "user-agent": `octokit-auth-oauth-app.js/${VERSION11} ${getUserAgent()}`
        }
      }),
      clientType: "oauth-app"
    },
    options
  );
  return Object.assign(auth4.bind(null, state), {
    hook: hook4.bind(null, state)
  });
}

// node_modules/universal-github-app-jwt/index.js
init_esm_shims();

// node_modules/universal-github-app-jwt/lib/get-token.js
init_esm_shims();

// node_modules/universal-github-app-jwt/lib/utils.js
init_esm_shims();
function isPkcs1(privateKey) {
  return privateKey.includes("-----BEGIN RSA PRIVATE KEY-----");
}
function isOpenSsh(privateKey) {
  return privateKey.includes("-----BEGIN OPENSSH PRIVATE KEY-----");
}
function string2ArrayBuffer(str) {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}
function getDERfromPEM(pem) {
  const pemB64 = pem.trim().split("\n").slice(1, -1).join("");
  const decoded = atob(pemB64);
  return string2ArrayBuffer(decoded);
}
function getEncodedMessage(header, payload) {
  return `${base64encodeJSON(header)}.${base64encodeJSON(payload)}`;
}
function base64encode(buffer) {
  var binary = "";
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return fromBase64(btoa(binary));
}
function fromBase64(base64) {
  return base64.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
function base64encodeJSON(obj) {
  return fromBase64(btoa(JSON.stringify(obj)));
}

// node_modules/universal-github-app-jwt/lib/crypto-node.js
init_esm_shims();
import { subtle } from "crypto";
import { createPrivateKey } from "crypto";
function convertPrivateKey(privateKey) {
  if (!isPkcs1(privateKey)) return privateKey;
  return createPrivateKey(privateKey).export({
    type: "pkcs8",
    format: "pem"
  });
}

// node_modules/universal-github-app-jwt/lib/get-token.js
async function getToken({ privateKey, payload }) {
  const convertedPrivateKey = convertPrivateKey(privateKey);
  if (isPkcs1(convertedPrivateKey)) {
    throw new Error(
      "[universal-github-app-jwt] Private Key is in PKCS#1 format, but only PKCS#8 is supported. See https://github.com/gr2m/universal-github-app-jwt#private-key-formats"
    );
  }
  if (isOpenSsh(convertedPrivateKey)) {
    throw new Error(
      "[universal-github-app-jwt] Private Key is in OpenSSH format, but only PKCS#8 is supported. See https://github.com/gr2m/universal-github-app-jwt#private-key-formats"
    );
  }
  const algorithm = {
    name: "RSASSA-PKCS1-v1_5",
    hash: { name: "SHA-256" }
  };
  const header = { alg: "RS256", typ: "JWT" };
  const privateKeyDER = getDERfromPEM(convertedPrivateKey);
  const importedKey = await subtle.importKey(
    "pkcs8",
    privateKeyDER,
    algorithm,
    false,
    ["sign"]
  );
  const encodedMessage = getEncodedMessage(header, payload);
  const encodedMessageArrBuf = string2ArrayBuffer(encodedMessage);
  const signatureArrBuf = await subtle.sign(
    algorithm.name,
    importedKey,
    encodedMessageArrBuf
  );
  const encodedSignature = base64encode(signatureArrBuf);
  return `${encodedMessage}.${encodedSignature}`;
}

// node_modules/universal-github-app-jwt/index.js
async function githubAppJwt({
  id,
  privateKey,
  now = Math.floor(Date.now() / 1e3)
}) {
  const privateKeyWithNewlines = privateKey.replace(/\\n/g, "\n");
  const nowWithSafetyMargin = now - 30;
  const expiration = nowWithSafetyMargin + 60 * 10;
  const payload = {
    iat: nowWithSafetyMargin,
    // Issued at time
    exp: expiration,
    iss: id
  };
  const token = await getToken({
    privateKey: privateKeyWithNewlines,
    payload
  });
  return {
    appId: id,
    expiration,
    token
  };
}

// node_modules/toad-cache/dist/toad-cache.mjs
init_esm_shims();
function validateCacheParams(max, ttlInMsecs) {
  if (typeof max !== "number" || !Number.isInteger(max) || max < 0) {
    throw new Error("Invalid max value");
  }
  if (typeof ttlInMsecs !== "number" || !Number.isInteger(ttlInMsecs) || ttlInMsecs < 0) {
    throw new Error("Invalid ttl value");
  }
}
var LruObject = class {
  constructor(max = 1e3, ttlInMsecs = 0) {
    validateCacheParams(max, ttlInMsecs);
    this.first = null;
    this.items = /* @__PURE__ */ Object.create(null);
    this.last = null;
    this.size = 0;
    this.max = max;
    this.ttl = ttlInMsecs;
  }
  bumpLru(item) {
    if (this.last === item) {
      return;
    }
    const last = this.last;
    const next = item.next;
    const prev = item.prev;
    if (this.first === item) {
      this.first = next;
    }
    item.next = null;
    item.prev = last;
    last.next = item;
    if (prev !== null) {
      prev.next = next;
    }
    if (next !== null) {
      next.prev = prev;
    }
    this.last = item;
  }
  clear() {
    this.items = /* @__PURE__ */ Object.create(null);
    this.first = null;
    this.last = null;
    this.size = 0;
  }
  delete(key) {
    const item = this.items[key];
    if (item !== void 0) {
      delete this.items[key];
      this.size--;
      if (item.prev !== null) {
        item.prev.next = item.next;
      }
      if (item.next !== null) {
        item.next.prev = item.prev;
      }
      if (this.first === item) {
        this.first = item.next;
      }
      if (this.last === item) {
        this.last = item.prev;
      }
    }
  }
  deleteMany(keys) {
    for (var i = 0; i < keys.length; i++) {
      this.delete(keys[i]);
    }
  }
  evict() {
    if (this.size > 0) {
      const item = this.first;
      delete this.items[item.key];
      if (--this.size === 0) {
        this.first = null;
        this.last = null;
      } else {
        this.first = item.next;
        this.first.prev = null;
      }
    }
  }
  expiresAt(key) {
    const item = this.items[key];
    if (item !== void 0) {
      return item.expiry;
    }
  }
  get(key) {
    const item = this.items[key];
    if (item !== void 0) {
      if (this.ttl > 0 && item.expiry <= Date.now()) {
        this.delete(key);
        return;
      }
      this.bumpLru(item);
      return item.value;
    }
  }
  getMany(keys) {
    const result = new Array(keys.length);
    for (var i = 0; i < keys.length; i++) {
      result[i] = this.get(keys[i]);
    }
    return result;
  }
  keys() {
    return Object.keys(this.items);
  }
  set(key, value) {
    const existing = this.items[key];
    if (existing !== void 0) {
      existing.value = value;
      existing.expiry = this.ttl > 0 ? Date.now() + this.ttl : this.ttl;
      this.bumpLru(existing);
      return;
    }
    if (this.max > 0 && this.size >= this.max) {
      this.evict();
    }
    const item = {
      expiry: this.ttl > 0 ? Date.now() + this.ttl : this.ttl,
      key,
      prev: this.last,
      next: null,
      value
    };
    this.items[key] = item;
    if (++this.size === 1) {
      this.first = item;
    } else {
      this.last.next = item;
    }
    this.last = item;
  }
};

// node_modules/@octokit/auth-app/dist-node/index.js
async function getAppAuthentication({
  appId,
  privateKey,
  timeDifference
}) {
  try {
    const authOptions = {
      id: appId,
      privateKey
    };
    if (timeDifference) {
      Object.assign(authOptions, {
        now: Math.floor(Date.now() / 1e3) + timeDifference
      });
    }
    const appAuthentication = await githubAppJwt(authOptions);
    return {
      type: "app",
      token: appAuthentication.token,
      appId: appAuthentication.appId,
      expiresAt: new Date(appAuthentication.expiration * 1e3).toISOString()
    };
  } catch (error) {
    if (privateKey === "-----BEGIN RSA PRIVATE KEY-----") {
      throw new Error(
        "The 'privateKey` option contains only the first line '-----BEGIN RSA PRIVATE KEY-----'. If you are setting it using a `.env` file, make sure it is set on a single line with newlines replaced by '\n'"
      );
    } else {
      throw error;
    }
  }
}
function getCache() {
  return new LruObject(
    // cache max. 15000 tokens, that will use less than 10mb memory
    15e3,
    // Cache for 1 minute less than GitHub expiry
    1e3 * 60 * 59
  );
}
async function get2(cache, options) {
  const cacheKey = optionsToCacheKey(options);
  const result = await cache.get(cacheKey);
  if (!result) {
    return;
  }
  const [
    token,
    createdAt,
    expiresAt,
    repositorySelection,
    permissionsString,
    singleFileName
  ] = result.split("|");
  const permissions = options.permissions || permissionsString.split(/,/).reduce((permissions2, string) => {
    if (/!$/.test(string)) {
      permissions2[string.slice(0, -1)] = "write";
    } else {
      permissions2[string] = "read";
    }
    return permissions2;
  }, {});
  return {
    token,
    createdAt,
    expiresAt,
    permissions,
    repositoryIds: options.repositoryIds,
    repositoryNames: options.repositoryNames,
    singleFileName,
    repositorySelection
  };
}
async function set2(cache, options, data) {
  const key = optionsToCacheKey(options);
  const permissionsString = options.permissions ? "" : Object.keys(data.permissions).map(
    (name) => `${name}${data.permissions[name] === "write" ? "!" : ""}`
  ).join(",");
  const value = [
    data.token,
    data.createdAt,
    data.expiresAt,
    data.repositorySelection,
    permissionsString,
    data.singleFileName
  ].join("|");
  await cache.set(key, value);
}
function optionsToCacheKey({
  installationId,
  permissions = {},
  repositoryIds = [],
  repositoryNames = []
}) {
  const permissionsString = Object.keys(permissions).sort().map((name) => permissions[name] === "read" ? name : `${name}!`).join(",");
  const repositoryIdsString = repositoryIds.sort().join(",");
  const repositoryNamesString = repositoryNames.join(",");
  return [
    installationId,
    repositoryIdsString,
    repositoryNamesString,
    permissionsString
  ].filter(Boolean).join("|");
}
function toTokenAuthentication({
  installationId,
  token,
  createdAt,
  expiresAt,
  repositorySelection,
  permissions,
  repositoryIds,
  repositoryNames,
  singleFileName
}) {
  return Object.assign(
    {
      type: "token",
      tokenType: "installation",
      token,
      installationId,
      permissions,
      createdAt,
      expiresAt,
      repositorySelection
    },
    repositoryIds ? { repositoryIds } : null,
    repositoryNames ? { repositoryNames } : null,
    singleFileName ? { singleFileName } : null
  );
}
async function getInstallationAuthentication(state, options, customRequest) {
  const installationId = Number(options.installationId || state.installationId);
  if (!installationId) {
    throw new Error(
      "[@octokit/auth-app] installationId option is required for installation authentication."
    );
  }
  if (options.factory) {
    const { type, factory, oauthApp, ...factoryAuthOptions } = {
      ...state,
      ...options
    };
    return factory(factoryAuthOptions);
  }
  const request2 = customRequest || state.request;
  return getInstallationAuthenticationConcurrently(
    state,
    { ...options, installationId },
    request2
  );
}
var pendingPromises = /* @__PURE__ */ new Map();
function getInstallationAuthenticationConcurrently(state, options, request2) {
  const cacheKey = optionsToCacheKey(options);
  if (pendingPromises.has(cacheKey)) {
    return pendingPromises.get(cacheKey);
  }
  const promise = getInstallationAuthenticationImpl(
    state,
    options,
    request2
  ).finally(() => pendingPromises.delete(cacheKey));
  pendingPromises.set(cacheKey, promise);
  return promise;
}
async function getInstallationAuthenticationImpl(state, options, request2) {
  if (!options.refresh) {
    const result = await get2(state.cache, options);
    if (result) {
      const {
        token: token2,
        createdAt: createdAt2,
        expiresAt: expiresAt2,
        permissions: permissions2,
        repositoryIds: repositoryIds2,
        repositoryNames: repositoryNames2,
        singleFileName: singleFileName2,
        repositorySelection: repositorySelection2
      } = result;
      return toTokenAuthentication({
        installationId: options.installationId,
        token: token2,
        createdAt: createdAt2,
        expiresAt: expiresAt2,
        permissions: permissions2,
        repositorySelection: repositorySelection2,
        repositoryIds: repositoryIds2,
        repositoryNames: repositoryNames2,
        singleFileName: singleFileName2
      });
    }
  }
  const appAuthentication = await getAppAuthentication(state);
  const payload = {
    installation_id: options.installationId,
    mediaType: {
      previews: ["machine-man"]
    },
    headers: {
      authorization: `bearer ${appAuthentication.token}`
    }
  };
  if (options.repositoryIds) {
    Object.assign(payload, { repository_ids: options.repositoryIds });
  }
  if (options.repositoryNames) {
    Object.assign(payload, {
      repositories: options.repositoryNames
    });
  }
  if (options.permissions) {
    Object.assign(payload, { permissions: options.permissions });
  }
  const {
    data: {
      token,
      expires_at: expiresAt,
      repositories,
      permissions: permissionsOptional,
      repository_selection: repositorySelectionOptional,
      single_file: singleFileName
    }
  } = await request2(
    "POST /app/installations/{installation_id}/access_tokens",
    payload
  );
  const permissions = permissionsOptional || {};
  const repositorySelection = repositorySelectionOptional || "all";
  const repositoryIds = repositories ? repositories.map((r) => r.id) : void 0;
  const repositoryNames = repositories ? repositories.map((repo) => repo.name) : void 0;
  const createdAt = (/* @__PURE__ */ new Date()).toISOString();
  const cacheOptions = {
    token,
    createdAt,
    expiresAt,
    repositorySelection,
    permissions,
    repositoryIds,
    repositoryNames
  };
  if (singleFileName) {
    Object.assign(payload, { singleFileName });
  }
  await set2(state.cache, options, cacheOptions);
  const cacheData = {
    installationId: options.installationId,
    token,
    createdAt,
    expiresAt,
    repositorySelection,
    permissions,
    repositoryIds,
    repositoryNames
  };
  if (singleFileName) {
    Object.assign(cacheData, { singleFileName });
  }
  return toTokenAuthentication(cacheData);
}
async function auth5(state, authOptions) {
  switch (authOptions.type) {
    case "app":
      return getAppAuthentication(state);
    case "oauth-app":
      return state.oauthApp({ type: "oauth-app" });
    case "installation":
      authOptions;
      return getInstallationAuthentication(state, {
        ...authOptions,
        type: "installation"
      });
    case "oauth-user":
      return state.oauthApp(authOptions);
    default:
      throw new Error(`Invalid auth type: ${authOptions.type}`);
  }
}
var PATHS = [
  "/app",
  "/app/hook/config",
  "/app/hook/deliveries",
  "/app/hook/deliveries/{delivery_id}",
  "/app/hook/deliveries/{delivery_id}/attempts",
  "/app/installations",
  "/app/installations/{installation_id}",
  "/app/installations/{installation_id}/access_tokens",
  "/app/installations/{installation_id}/suspended",
  "/app/installation-requests",
  "/marketplace_listing/accounts/{account_id}",
  "/marketplace_listing/plan",
  "/marketplace_listing/plans",
  "/marketplace_listing/plans/{plan_id}/accounts",
  "/marketplace_listing/stubbed/accounts/{account_id}",
  "/marketplace_listing/stubbed/plan",
  "/marketplace_listing/stubbed/plans",
  "/marketplace_listing/stubbed/plans/{plan_id}/accounts",
  "/orgs/{org}/installation",
  "/repos/{owner}/{repo}/installation",
  "/users/{username}/installation"
];
function routeMatcher2(paths) {
  const regexes = paths.map(
    (p) => p.split("/").map((c) => c.startsWith("{") ? "(?:.+?)" : c).join("/")
  );
  const regex2 = `^(?:${regexes.map((r) => `(?:${r})`).join("|")})$`;
  return new RegExp(regex2, "i");
}
var REGEX = routeMatcher2(PATHS);
function requiresAppAuth(url) {
  return !!url && REGEX.test(url.split("?")[0]);
}
var FIVE_SECONDS_IN_MS = 5 * 1e3;
function isNotTimeSkewError(error) {
  return !(error.message.match(
    /'Expiration time' claim \('exp'\) must be a numeric value representing the future time at which the assertion expires/
  ) || error.message.match(
    /'Issued at' claim \('iat'\) must be an Integer representing the time that the assertion was issued/
  ));
}
async function hook5(state, request2, route, parameters) {
  const endpoint2 = request2.endpoint.merge(route, parameters);
  const url = endpoint2.url;
  if (/\/login\/oauth\/access_token$/.test(url)) {
    return request2(endpoint2);
  }
  if (requiresAppAuth(url.replace(request2.endpoint.DEFAULTS.baseUrl, ""))) {
    const { token: token2 } = await getAppAuthentication(state);
    endpoint2.headers.authorization = `bearer ${token2}`;
    let response;
    try {
      response = await request2(endpoint2);
    } catch (error) {
      if (isNotTimeSkewError(error)) {
        throw error;
      }
      if (typeof error.response.headers.date === "undefined") {
        throw error;
      }
      const diff = Math.floor(
        (Date.parse(error.response.headers.date) - Date.parse((/* @__PURE__ */ new Date()).toString())) / 1e3
      );
      state.log.warn(error.message);
      state.log.warn(
        `[@octokit/auth-app] GitHub API time and system time are different by ${diff} seconds. Retrying request with the difference accounted for.`
      );
      const { token: token3 } = await getAppAuthentication({
        ...state,
        timeDifference: diff
      });
      endpoint2.headers.authorization = `bearer ${token3}`;
      return request2(endpoint2);
    }
    return response;
  }
  if (requiresBasicAuth(url)) {
    const authentication = await state.oauthApp({ type: "oauth-app" });
    endpoint2.headers.authorization = authentication.headers.authorization;
    return request2(endpoint2);
  }
  const { token, createdAt } = await getInstallationAuthentication(
    state,
    // @ts-expect-error TBD
    {},
    request2.defaults({ baseUrl: endpoint2.baseUrl })
  );
  endpoint2.headers.authorization = `token ${token}`;
  return sendRequestWithRetries(
    state,
    request2,
    endpoint2,
    createdAt
  );
}
async function sendRequestWithRetries(state, request2, options, createdAt, retries = 0) {
  const timeSinceTokenCreationInMs = +/* @__PURE__ */ new Date() - +new Date(createdAt);
  try {
    return await request2(options);
  } catch (error) {
    if (error.status !== 401) {
      throw error;
    }
    if (timeSinceTokenCreationInMs >= FIVE_SECONDS_IN_MS) {
      if (retries > 0) {
        error.message = `After ${retries} retries within ${timeSinceTokenCreationInMs / 1e3}s of creating the installation access token, the response remains 401. At this point, the cause may be an authentication problem or a system outage. Please check https://www.githubstatus.com for status information`;
      }
      throw error;
    }
    ++retries;
    const awaitTime = retries * 1e3;
    state.log.warn(
      `[@octokit/auth-app] Retrying after 401 response to account for token replication delay (retry: ${retries}, wait: ${awaitTime / 1e3}s)`
    );
    await new Promise((resolve2) => setTimeout(resolve2, awaitTime));
    return sendRequestWithRetries(state, request2, options, createdAt, retries);
  }
}
var VERSION12 = "7.2.2";
function createAppAuth(options) {
  if (!options.appId) {
    throw new Error("[@octokit/auth-app] appId option is required");
  }
  if (!options.privateKey) {
    throw new Error("[@octokit/auth-app] privateKey option is required");
  }
  if ("installationId" in options && !options.installationId) {
    throw new Error(
      "[@octokit/auth-app] installationId is set to a falsy value"
    );
  }
  const log = options.log || {};
  if (typeof log.warn !== "function") {
    log.warn = console.warn.bind(console);
  }
  const request2 = options.request || request.defaults({
    headers: {
      "user-agent": `octokit-auth-app.js/${VERSION12} ${getUserAgent()}`
    }
  });
  const state = Object.assign(
    {
      request: request2,
      cache: getCache()
    },
    options,
    options.installationId ? { installationId: Number(options.installationId) } : {},
    {
      log,
      oauthApp: createOAuthAppAuth({
        clientType: "github-app",
        clientId: options.clientId || "",
        clientSecret: options.clientSecret || "",
        request: request2
      })
    }
  );
  return Object.assign(auth5.bind(null, state), {
    hook: hook5.bind(null, state)
  });
}

// node_modules/@octokit/oauth-app/dist-node/index.js
init_esm_shims();

// node_modules/@octokit/auth-unauthenticated/dist-node/index.js
init_esm_shims();
async function auth6(reason) {
  return {
    type: "unauthenticated",
    reason
  };
}
function isRateLimitError(error) {
  if (error.status !== 403) {
    return false;
  }
  if (!error.response) {
    return false;
  }
  return error.response.headers["x-ratelimit-remaining"] === "0";
}
var REGEX_ABUSE_LIMIT_MESSAGE = /\babuse\b/i;
function isAbuseLimitError(error) {
  if (error.status !== 403) {
    return false;
  }
  return REGEX_ABUSE_LIMIT_MESSAGE.test(error.message);
}
async function hook6(reason, request2, route, parameters) {
  const endpoint2 = request2.endpoint.merge(
    route,
    parameters
  );
  return request2(endpoint2).catch((error) => {
    if (error.status === 404) {
      error.message = `Not found. May be due to lack of authentication. Reason: ${reason}`;
      throw error;
    }
    if (isRateLimitError(error)) {
      error.message = `API rate limit exceeded. This maybe caused by the lack of authentication. Reason: ${reason}`;
      throw error;
    }
    if (isAbuseLimitError(error)) {
      error.message = `You have triggered an abuse detection mechanism. This maybe caused by the lack of authentication. Reason: ${reason}`;
      throw error;
    }
    if (error.status === 401) {
      error.message = `Unauthorized. "${endpoint2.method} ${endpoint2.url}" failed most likely due to lack of authentication. Reason: ${reason}`;
      throw error;
    }
    if (error.status >= 400 && error.status < 500) {
      error.message = error.message.replace(
        /\.?$/,
        `. May be caused by lack of authentication (${reason}).`
      );
    }
    throw error;
  });
}
var createUnauthenticatedAuth = function createUnauthenticatedAuth2(options) {
  if (!options || !options.reason) {
    throw new Error(
      "[@octokit/auth-unauthenticated] No reason passed to createUnauthenticatedAuth"
    );
  }
  return Object.assign(auth6.bind(null, options.reason), {
    hook: hook6.bind(null, options.reason)
  });
};

// node_modules/@octokit/oauth-app/dist-node/index.js
var VERSION13 = "7.1.6";
function addEventHandler(state, eventName, eventHandler) {
  if (Array.isArray(eventName)) {
    for (const singleEventName of eventName) {
      addEventHandler(state, singleEventName, eventHandler);
    }
    return;
  }
  if (!state.eventHandlers[eventName]) {
    state.eventHandlers[eventName] = [];
  }
  state.eventHandlers[eventName].push(eventHandler);
}
var OAuthAppOctokit = Octokit.defaults({
  userAgent: `octokit-oauth-app.js/${VERSION13} ${getUserAgent()}`
});
async function emitEvent(state, context) {
  const { name, action } = context;
  if (state.eventHandlers[`${name}.${action}`]) {
    for (const eventHandler of state.eventHandlers[`${name}.${action}`]) {
      await eventHandler(context);
    }
  }
  if (state.eventHandlers[name]) {
    for (const eventHandler of state.eventHandlers[name]) {
      await eventHandler(context);
    }
  }
}
async function getUserOctokitWithState(state, options) {
  return state.octokit.auth({
    type: "oauth-user",
    ...options,
    async factory(options2) {
      const octokit2 = new state.Octokit({
        authStrategy: createOAuthUserAuth,
        auth: options2
      });
      const authentication = await octokit2.auth({
        type: "get"
      });
      await emitEvent(state, {
        name: "token",
        action: "created",
        token: authentication.token,
        scopes: authentication.scopes,
        authentication,
        octokit: octokit2
      });
      return octokit2;
    }
  });
}
function getWebFlowAuthorizationUrlWithState(state, options) {
  const optionsWithDefaults = {
    clientId: state.clientId,
    request: state.octokit.request,
    ...options,
    allowSignup: state.allowSignup ?? options.allowSignup,
    redirectUrl: options.redirectUrl ?? state.redirectUrl,
    scopes: options.scopes ?? state.defaultScopes
  };
  return getWebFlowAuthorizationUrl({
    clientType: state.clientType,
    ...optionsWithDefaults
  });
}
async function createTokenWithState(state, options) {
  const authentication = await state.octokit.auth({
    type: "oauth-user",
    ...options
  });
  await emitEvent(state, {
    name: "token",
    action: "created",
    token: authentication.token,
    scopes: authentication.scopes,
    authentication,
    octokit: new state.Octokit({
      authStrategy: createOAuthUserAuth,
      auth: {
        clientType: state.clientType,
        clientId: state.clientId,
        clientSecret: state.clientSecret,
        token: authentication.token,
        scopes: authentication.scopes,
        refreshToken: authentication.refreshToken,
        expiresAt: authentication.expiresAt,
        refreshTokenExpiresAt: authentication.refreshTokenExpiresAt
      }
    })
  });
  return { authentication };
}
async function checkTokenWithState(state, options) {
  const result = await checkToken({
    // @ts-expect-error not worth the extra code to appease TS
    clientType: state.clientType,
    clientId: state.clientId,
    clientSecret: state.clientSecret,
    request: state.octokit.request,
    ...options
  });
  Object.assign(result.authentication, { type: "token", tokenType: "oauth" });
  return result;
}
async function resetTokenWithState(state, options) {
  const optionsWithDefaults = {
    clientId: state.clientId,
    clientSecret: state.clientSecret,
    request: state.octokit.request,
    ...options
  };
  if (state.clientType === "oauth-app") {
    const response2 = await resetToken({
      clientType: "oauth-app",
      ...optionsWithDefaults
    });
    const authentication2 = Object.assign(response2.authentication, {
      type: "token",
      tokenType: "oauth"
    });
    await emitEvent(state, {
      name: "token",
      action: "reset",
      token: response2.authentication.token,
      scopes: response2.authentication.scopes || void 0,
      authentication: authentication2,
      octokit: new state.Octokit({
        authStrategy: createOAuthUserAuth,
        auth: {
          clientType: state.clientType,
          clientId: state.clientId,
          clientSecret: state.clientSecret,
          token: response2.authentication.token,
          scopes: response2.authentication.scopes
        }
      })
    });
    return { ...response2, authentication: authentication2 };
  }
  const response = await resetToken({
    clientType: "github-app",
    ...optionsWithDefaults
  });
  const authentication = Object.assign(response.authentication, {
    type: "token",
    tokenType: "oauth"
  });
  await emitEvent(state, {
    name: "token",
    action: "reset",
    token: response.authentication.token,
    authentication,
    octokit: new state.Octokit({
      authStrategy: createOAuthUserAuth,
      auth: {
        clientType: state.clientType,
        clientId: state.clientId,
        clientSecret: state.clientSecret,
        token: response.authentication.token
      }
    })
  });
  return { ...response, authentication };
}
async function refreshTokenWithState(state, options) {
  if (state.clientType === "oauth-app") {
    throw new Error(
      "[@octokit/oauth-app] app.refreshToken() is not supported for OAuth Apps"
    );
  }
  const response = await refreshToken({
    clientType: "github-app",
    clientId: state.clientId,
    clientSecret: state.clientSecret,
    request: state.octokit.request,
    refreshToken: options.refreshToken
  });
  const authentication = Object.assign(response.authentication, {
    type: "token",
    tokenType: "oauth"
  });
  await emitEvent(state, {
    name: "token",
    action: "refreshed",
    token: response.authentication.token,
    authentication,
    octokit: new state.Octokit({
      authStrategy: createOAuthUserAuth,
      auth: {
        clientType: state.clientType,
        clientId: state.clientId,
        clientSecret: state.clientSecret,
        token: response.authentication.token
      }
    })
  });
  return { ...response, authentication };
}
async function scopeTokenWithState(state, options) {
  if (state.clientType === "oauth-app") {
    throw new Error(
      "[@octokit/oauth-app] app.scopeToken() is not supported for OAuth Apps"
    );
  }
  const response = await scopeToken({
    clientType: "github-app",
    clientId: state.clientId,
    clientSecret: state.clientSecret,
    request: state.octokit.request,
    ...options
  });
  const authentication = Object.assign(response.authentication, {
    type: "token",
    tokenType: "oauth"
  });
  await emitEvent(state, {
    name: "token",
    action: "scoped",
    token: response.authentication.token,
    authentication,
    octokit: new state.Octokit({
      authStrategy: createOAuthUserAuth,
      auth: {
        clientType: state.clientType,
        clientId: state.clientId,
        clientSecret: state.clientSecret,
        token: response.authentication.token
      }
    })
  });
  return { ...response, authentication };
}
async function deleteTokenWithState(state, options) {
  const optionsWithDefaults = {
    clientId: state.clientId,
    clientSecret: state.clientSecret,
    request: state.octokit.request,
    ...options
  };
  const response = state.clientType === "oauth-app" ? await deleteToken({
    clientType: "oauth-app",
    ...optionsWithDefaults
  }) : (
    /* v8 ignore next 4 */
    await deleteToken({
      clientType: "github-app",
      ...optionsWithDefaults
    })
  );
  await emitEvent(state, {
    name: "token",
    action: "deleted",
    token: options.token,
    octokit: new state.Octokit({
      authStrategy: createUnauthenticatedAuth,
      auth: {
        reason: `Handling "token.deleted" event. The access for the token has been revoked.`
      }
    })
  });
  return response;
}
async function deleteAuthorizationWithState(state, options) {
  const optionsWithDefaults = {
    clientId: state.clientId,
    clientSecret: state.clientSecret,
    request: state.octokit.request,
    ...options
  };
  const response = state.clientType === "oauth-app" ? await deleteAuthorization({
    clientType: "oauth-app",
    ...optionsWithDefaults
  }) : (
    /* v8 ignore next 4 */
    await deleteAuthorization({
      clientType: "github-app",
      ...optionsWithDefaults
    })
  );
  await emitEvent(state, {
    name: "token",
    action: "deleted",
    token: options.token,
    octokit: new state.Octokit({
      authStrategy: createUnauthenticatedAuth,
      auth: {
        reason: `Handling "token.deleted" event. The access for the token has been revoked.`
      }
    })
  });
  await emitEvent(state, {
    name: "authorization",
    action: "deleted",
    token: options.token,
    octokit: new state.Octokit({
      authStrategy: createUnauthenticatedAuth,
      auth: {
        reason: `Handling "authorization.deleted" event. The access for the app has been revoked.`
      }
    })
  });
  return response;
}
var OAuthApp = class {
  static VERSION = VERSION13;
  static defaults(defaults) {
    const OAuthAppWithDefaults = class extends this {
      constructor(...args) {
        super({
          ...defaults,
          ...args[0]
        });
      }
    };
    return OAuthAppWithDefaults;
  }
  constructor(options) {
    const Octokit22 = options.Octokit || OAuthAppOctokit;
    this.type = options.clientType || "oauth-app";
    const octokit2 = new Octokit22({
      authStrategy: createOAuthAppAuth,
      auth: {
        clientType: this.type,
        clientId: options.clientId,
        clientSecret: options.clientSecret
      }
    });
    const state = {
      clientType: this.type,
      clientId: options.clientId,
      clientSecret: options.clientSecret,
      // @ts-expect-error defaultScopes not permitted for GitHub Apps
      defaultScopes: options.defaultScopes || [],
      allowSignup: options.allowSignup,
      baseUrl: options.baseUrl,
      redirectUrl: options.redirectUrl,
      log: options.log,
      Octokit: Octokit22,
      octokit: octokit2,
      eventHandlers: {}
    };
    this.on = addEventHandler.bind(null, state);
    this.octokit = octokit2;
    this.getUserOctokit = getUserOctokitWithState.bind(null, state);
    this.getWebFlowAuthorizationUrl = getWebFlowAuthorizationUrlWithState.bind(
      null,
      state
    );
    this.createToken = createTokenWithState.bind(
      null,
      state
    );
    this.checkToken = checkTokenWithState.bind(
      null,
      state
    );
    this.resetToken = resetTokenWithState.bind(
      null,
      state
    );
    this.refreshToken = refreshTokenWithState.bind(
      null,
      state
    );
    this.scopeToken = scopeTokenWithState.bind(
      null,
      state
    );
    this.deleteToken = deleteTokenWithState.bind(null, state);
    this.deleteAuthorization = deleteAuthorizationWithState.bind(null, state);
  }
  // assigned during constructor
  type;
  on;
  octokit;
  getUserOctokit;
  getWebFlowAuthorizationUrl;
  createToken;
  checkToken;
  resetToken;
  refreshToken;
  scopeToken;
  deleteToken;
  deleteAuthorization;
};

// node_modules/@octokit/webhooks/dist-bundle/index.js
init_esm_shims();

// node_modules/@octokit/webhooks-methods/dist-node/index.js
init_esm_shims();
import { createHmac } from "crypto";
import { timingSafeEqual } from "crypto";
import { Buffer as Buffer2 } from "buffer";
var VERSION14 = "5.1.1";
async function sign(secret, payload) {
  if (!secret || !payload) {
    throw new TypeError(
      "[@octokit/webhooks-methods] secret & payload required for sign()"
    );
  }
  if (typeof payload !== "string") {
    throw new TypeError("[@octokit/webhooks-methods] payload must be a string");
  }
  const algorithm = "sha256";
  return `${algorithm}=${createHmac(algorithm, secret).update(payload).digest("hex")}`;
}
sign.VERSION = VERSION14;
async function verify(secret, eventPayload, signature) {
  if (!secret || !eventPayload || !signature) {
    throw new TypeError(
      "[@octokit/webhooks-methods] secret, eventPayload & signature required"
    );
  }
  if (typeof eventPayload !== "string") {
    throw new TypeError(
      "[@octokit/webhooks-methods] eventPayload must be a string"
    );
  }
  const signatureBuffer = Buffer2.from(signature);
  const verificationBuffer = Buffer2.from(await sign(secret, eventPayload));
  if (signatureBuffer.length !== verificationBuffer.length) {
    return false;
  }
  return timingSafeEqual(signatureBuffer, verificationBuffer);
}
verify.VERSION = VERSION14;
async function verifyWithFallback(secret, payload, signature, additionalSecrets) {
  const firstPass = await verify(secret, payload, signature);
  if (firstPass) {
    return true;
  }
  if (additionalSecrets !== void 0) {
    for (const s of additionalSecrets) {
      const v = await verify(s, payload, signature);
      if (v) {
        return v;
      }
    }
  }
  return false;
}

// node_modules/@octokit/webhooks/dist-bundle/index.js
var createLogger2 = (logger = {}) => {
  if (typeof logger.debug !== "function") {
    logger.debug = () => {
    };
  }
  if (typeof logger.info !== "function") {
    logger.info = () => {
    };
  }
  if (typeof logger.warn !== "function") {
    logger.warn = console.warn.bind(console);
  }
  if (typeof logger.error !== "function") {
    logger.error = console.error.bind(console);
  }
  return logger;
};
var emitterEventNames = [
  "branch_protection_configuration",
  "branch_protection_configuration.disabled",
  "branch_protection_configuration.enabled",
  "branch_protection_rule",
  "branch_protection_rule.created",
  "branch_protection_rule.deleted",
  "branch_protection_rule.edited",
  "check_run",
  "check_run.completed",
  "check_run.created",
  "check_run.requested_action",
  "check_run.rerequested",
  "check_suite",
  "check_suite.completed",
  "check_suite.requested",
  "check_suite.rerequested",
  "code_scanning_alert",
  "code_scanning_alert.appeared_in_branch",
  "code_scanning_alert.closed_by_user",
  "code_scanning_alert.created",
  "code_scanning_alert.fixed",
  "code_scanning_alert.reopened",
  "code_scanning_alert.reopened_by_user",
  "commit_comment",
  "commit_comment.created",
  "create",
  "custom_property",
  "custom_property.created",
  "custom_property.deleted",
  "custom_property.promote_to_enterprise",
  "custom_property.updated",
  "custom_property_values",
  "custom_property_values.updated",
  "delete",
  "dependabot_alert",
  "dependabot_alert.auto_dismissed",
  "dependabot_alert.auto_reopened",
  "dependabot_alert.created",
  "dependabot_alert.dismissed",
  "dependabot_alert.fixed",
  "dependabot_alert.reintroduced",
  "dependabot_alert.reopened",
  "deploy_key",
  "deploy_key.created",
  "deploy_key.deleted",
  "deployment",
  "deployment.created",
  "deployment_protection_rule",
  "deployment_protection_rule.requested",
  "deployment_review",
  "deployment_review.approved",
  "deployment_review.rejected",
  "deployment_review.requested",
  "deployment_status",
  "deployment_status.created",
  "discussion",
  "discussion.answered",
  "discussion.category_changed",
  "discussion.closed",
  "discussion.created",
  "discussion.deleted",
  "discussion.edited",
  "discussion.labeled",
  "discussion.locked",
  "discussion.pinned",
  "discussion.reopened",
  "discussion.transferred",
  "discussion.unanswered",
  "discussion.unlabeled",
  "discussion.unlocked",
  "discussion.unpinned",
  "discussion_comment",
  "discussion_comment.created",
  "discussion_comment.deleted",
  "discussion_comment.edited",
  "fork",
  "github_app_authorization",
  "github_app_authorization.revoked",
  "gollum",
  "installation",
  "installation.created",
  "installation.deleted",
  "installation.new_permissions_accepted",
  "installation.suspend",
  "installation.unsuspend",
  "installation_repositories",
  "installation_repositories.added",
  "installation_repositories.removed",
  "installation_target",
  "installation_target.renamed",
  "issue_comment",
  "issue_comment.created",
  "issue_comment.deleted",
  "issue_comment.edited",
  "issues",
  "issues.assigned",
  "issues.closed",
  "issues.deleted",
  "issues.demilestoned",
  "issues.edited",
  "issues.labeled",
  "issues.locked",
  "issues.milestoned",
  "issues.opened",
  "issues.pinned",
  "issues.reopened",
  "issues.transferred",
  "issues.typed",
  "issues.unassigned",
  "issues.unlabeled",
  "issues.unlocked",
  "issues.unpinned",
  "issues.untyped",
  "label",
  "label.created",
  "label.deleted",
  "label.edited",
  "marketplace_purchase",
  "marketplace_purchase.cancelled",
  "marketplace_purchase.changed",
  "marketplace_purchase.pending_change",
  "marketplace_purchase.pending_change_cancelled",
  "marketplace_purchase.purchased",
  "member",
  "member.added",
  "member.edited",
  "member.removed",
  "membership",
  "membership.added",
  "membership.removed",
  "merge_group",
  "merge_group.checks_requested",
  "merge_group.destroyed",
  "meta",
  "meta.deleted",
  "milestone",
  "milestone.closed",
  "milestone.created",
  "milestone.deleted",
  "milestone.edited",
  "milestone.opened",
  "org_block",
  "org_block.blocked",
  "org_block.unblocked",
  "organization",
  "organization.deleted",
  "organization.member_added",
  "organization.member_invited",
  "organization.member_removed",
  "organization.renamed",
  "package",
  "package.published",
  "package.updated",
  "page_build",
  "personal_access_token_request",
  "personal_access_token_request.approved",
  "personal_access_token_request.cancelled",
  "personal_access_token_request.created",
  "personal_access_token_request.denied",
  "ping",
  "project",
  "project.closed",
  "project.created",
  "project.deleted",
  "project.edited",
  "project.reopened",
  "project_card",
  "project_card.converted",
  "project_card.created",
  "project_card.deleted",
  "project_card.edited",
  "project_card.moved",
  "project_column",
  "project_column.created",
  "project_column.deleted",
  "project_column.edited",
  "project_column.moved",
  "projects_v2",
  "projects_v2.closed",
  "projects_v2.created",
  "projects_v2.deleted",
  "projects_v2.edited",
  "projects_v2.reopened",
  "projects_v2_item",
  "projects_v2_item.archived",
  "projects_v2_item.converted",
  "projects_v2_item.created",
  "projects_v2_item.deleted",
  "projects_v2_item.edited",
  "projects_v2_item.reordered",
  "projects_v2_item.restored",
  "projects_v2_status_update",
  "projects_v2_status_update.created",
  "projects_v2_status_update.deleted",
  "projects_v2_status_update.edited",
  "public",
  "pull_request",
  "pull_request.assigned",
  "pull_request.auto_merge_disabled",
  "pull_request.auto_merge_enabled",
  "pull_request.closed",
  "pull_request.converted_to_draft",
  "pull_request.demilestoned",
  "pull_request.dequeued",
  "pull_request.edited",
  "pull_request.enqueued",
  "pull_request.labeled",
  "pull_request.locked",
  "pull_request.milestoned",
  "pull_request.opened",
  "pull_request.ready_for_review",
  "pull_request.reopened",
  "pull_request.review_request_removed",
  "pull_request.review_requested",
  "pull_request.synchronize",
  "pull_request.unassigned",
  "pull_request.unlabeled",
  "pull_request.unlocked",
  "pull_request_review",
  "pull_request_review.dismissed",
  "pull_request_review.edited",
  "pull_request_review.submitted",
  "pull_request_review_comment",
  "pull_request_review_comment.created",
  "pull_request_review_comment.deleted",
  "pull_request_review_comment.edited",
  "pull_request_review_thread",
  "pull_request_review_thread.resolved",
  "pull_request_review_thread.unresolved",
  "push",
  "registry_package",
  "registry_package.published",
  "registry_package.updated",
  "release",
  "release.created",
  "release.deleted",
  "release.edited",
  "release.prereleased",
  "release.published",
  "release.released",
  "release.unpublished",
  "repository",
  "repository.archived",
  "repository.created",
  "repository.deleted",
  "repository.edited",
  "repository.privatized",
  "repository.publicized",
  "repository.renamed",
  "repository.transferred",
  "repository.unarchived",
  "repository_advisory",
  "repository_advisory.published",
  "repository_advisory.reported",
  "repository_dispatch",
  "repository_dispatch.sample.collected",
  "repository_import",
  "repository_ruleset",
  "repository_ruleset.created",
  "repository_ruleset.deleted",
  "repository_ruleset.edited",
  "repository_vulnerability_alert",
  "repository_vulnerability_alert.create",
  "repository_vulnerability_alert.dismiss",
  "repository_vulnerability_alert.reopen",
  "repository_vulnerability_alert.resolve",
  "secret_scanning_alert",
  "secret_scanning_alert.created",
  "secret_scanning_alert.publicly_leaked",
  "secret_scanning_alert.reopened",
  "secret_scanning_alert.resolved",
  "secret_scanning_alert.validated",
  "secret_scanning_alert_location",
  "secret_scanning_alert_location.created",
  "secret_scanning_scan",
  "secret_scanning_scan.completed",
  "security_advisory",
  "security_advisory.published",
  "security_advisory.updated",
  "security_advisory.withdrawn",
  "security_and_analysis",
  "sponsorship",
  "sponsorship.cancelled",
  "sponsorship.created",
  "sponsorship.edited",
  "sponsorship.pending_cancellation",
  "sponsorship.pending_tier_change",
  "sponsorship.tier_changed",
  "star",
  "star.created",
  "star.deleted",
  "status",
  "sub_issues",
  "sub_issues.parent_issue_added",
  "sub_issues.parent_issue_removed",
  "sub_issues.sub_issue_added",
  "sub_issues.sub_issue_removed",
  "team",
  "team.added_to_repository",
  "team.created",
  "team.deleted",
  "team.edited",
  "team.removed_from_repository",
  "team_add",
  "watch",
  "watch.started",
  "workflow_dispatch",
  "workflow_job",
  "workflow_job.completed",
  "workflow_job.in_progress",
  "workflow_job.queued",
  "workflow_job.waiting",
  "workflow_run",
  "workflow_run.completed",
  "workflow_run.in_progress",
  "workflow_run.requested"
];
function handleEventHandlers(state, webhookName, handler2) {
  if (!state.hooks[webhookName]) {
    state.hooks[webhookName] = [];
  }
  state.hooks[webhookName].push(handler2);
}
function receiverOn(state, webhookNameOrNames, handler2) {
  if (Array.isArray(webhookNameOrNames)) {
    webhookNameOrNames.forEach(
      (webhookName) => receiverOn(state, webhookName, handler2)
    );
    return;
  }
  if (["*", "error"].includes(webhookNameOrNames)) {
    const webhookName = webhookNameOrNames === "*" ? "any" : webhookNameOrNames;
    const message = `Using the "${webhookNameOrNames}" event with the regular Webhooks.on() function is not supported. Please use the Webhooks.on${webhookName.charAt(0).toUpperCase() + webhookName.slice(1)}() method instead`;
    throw new Error(message);
  }
  if (!emitterEventNames.includes(webhookNameOrNames)) {
    state.log.warn(
      `"${webhookNameOrNames}" is not a known webhook name (https://developer.github.com/v3/activity/events/types/)`
    );
  }
  handleEventHandlers(state, webhookNameOrNames, handler2);
}
function receiverOnAny(state, handler2) {
  handleEventHandlers(state, "*", handler2);
}
function receiverOnError(state, handler2) {
  handleEventHandlers(state, "error", handler2);
}
function wrapErrorHandler(handler2, error) {
  let returnValue;
  try {
    returnValue = handler2(error);
  } catch (error2) {
    console.log('FATAL: Error occurred in "error" event handler');
    console.log(error2);
  }
  if (returnValue && returnValue.catch) {
    returnValue.catch((error2) => {
      console.log('FATAL: Error occurred in "error" event handler');
      console.log(error2);
    });
  }
}
function getHooks(state, eventPayloadAction, eventName) {
  const hooks = [state.hooks[eventName], state.hooks["*"]];
  if (eventPayloadAction) {
    hooks.unshift(state.hooks[`${eventName}.${eventPayloadAction}`]);
  }
  return [].concat(...hooks.filter(Boolean));
}
function receiverHandle(state, event) {
  const errorHandlers = state.hooks.error || [];
  if (event instanceof Error) {
    const error = Object.assign(new AggregateError([event], event.message), {
      event
    });
    errorHandlers.forEach((handler2) => wrapErrorHandler(handler2, error));
    return Promise.reject(error);
  }
  if (!event || !event.name) {
    const error = new Error("Event name not passed");
    throw new AggregateError([error], error.message);
  }
  if (!event.payload) {
    const error = new Error("Event name not passed");
    throw new AggregateError([error], error.message);
  }
  const hooks = getHooks(
    state,
    "action" in event.payload ? event.payload.action : null,
    event.name
  );
  if (hooks.length === 0) {
    return Promise.resolve();
  }
  const errors = [];
  const promises = hooks.map((handler2) => {
    let promise = Promise.resolve(event);
    if (state.transform) {
      promise = promise.then(state.transform);
    }
    return promise.then((event2) => {
      return handler2(event2);
    }).catch((error) => errors.push(Object.assign(error, { event })));
  });
  return Promise.all(promises).then(() => {
    if (errors.length === 0) {
      return;
    }
    const error = new AggregateError(
      errors,
      errors.map((error2) => error2.message).join("\n")
    );
    Object.assign(error, {
      event
    });
    errorHandlers.forEach((handler2) => wrapErrorHandler(handler2, error));
    throw error;
  });
}
function removeListener(state, webhookNameOrNames, handler2) {
  if (Array.isArray(webhookNameOrNames)) {
    webhookNameOrNames.forEach(
      (webhookName) => removeListener(state, webhookName, handler2)
    );
    return;
  }
  if (!state.hooks[webhookNameOrNames]) {
    return;
  }
  for (let i = state.hooks[webhookNameOrNames].length - 1; i >= 0; i--) {
    if (state.hooks[webhookNameOrNames][i] === handler2) {
      state.hooks[webhookNameOrNames].splice(i, 1);
      return;
    }
  }
}
function createEventHandler(options) {
  const state = {
    hooks: {},
    log: createLogger2(options && options.log)
  };
  if (options && options.transform) {
    state.transform = options.transform;
  }
  return {
    on: receiverOn.bind(null, state),
    onAny: receiverOnAny.bind(null, state),
    onError: receiverOnError.bind(null, state),
    removeListener: removeListener.bind(null, state),
    receive: receiverHandle.bind(null, state)
  };
}
async function verifyAndReceive(state, event) {
  const matchesSignature = await verifyWithFallback(
    state.secret,
    event.payload,
    event.signature,
    state.additionalSecrets
  ).catch(() => false);
  if (!matchesSignature) {
    const error = new Error(
      "[@octokit/webhooks] signature does not match event payload and secret"
    );
    return state.eventHandler.receive(
      Object.assign(error, { event, status: 400 })
    );
  }
  let payload;
  try {
    payload = JSON.parse(event.payload);
  } catch (error) {
    error.message = "Invalid JSON";
    error.status = 400;
    throw new AggregateError([error], error.message);
  }
  return state.eventHandler.receive({
    id: event.id,
    name: event.name,
    payload
  });
}
var textDecoder = new TextDecoder("utf-8", { fatal: false });
var decode = textDecoder.decode.bind(textDecoder);
var Webhooks = class {
  sign;
  verify;
  on;
  onAny;
  onError;
  removeListener;
  receive;
  verifyAndReceive;
  constructor(options) {
    if (!options || !options.secret) {
      throw new Error("[@octokit/webhooks] options.secret required");
    }
    const state = {
      eventHandler: createEventHandler(options),
      secret: options.secret,
      additionalSecrets: options.additionalSecrets,
      hooks: {},
      log: createLogger2(options.log)
    };
    this.sign = sign.bind(null, options.secret);
    this.verify = verify.bind(null, options.secret);
    this.on = state.eventHandler.on;
    this.onAny = state.eventHandler.onAny;
    this.onError = state.eventHandler.onError;
    this.removeListener = state.eventHandler.removeListener;
    this.receive = state.eventHandler.receive;
    this.verifyAndReceive = verifyAndReceive.bind(null, state);
  }
};

// node_modules/@octokit/app/dist-node/index.js
var VERSION15 = "15.1.6";
function webhooks(appOctokit, options) {
  return new Webhooks({
    secret: options.secret,
    transform: async (event) => {
      if (!("installation" in event.payload) || typeof event.payload.installation !== "object") {
        const octokit22 = new appOctokit.constructor({
          authStrategy: createUnauthenticatedAuth,
          auth: {
            reason: `"installation" key missing in webhook event payload`
          }
        });
        return {
          ...event,
          octokit: octokit22
        };
      }
      const installationId = event.payload.installation.id;
      const octokit2 = await appOctokit.auth({
        type: "installation",
        installationId,
        factory(auth7) {
          return new auth7.octokit.constructor({
            ...auth7.octokitOptions,
            authStrategy: createAppAuth,
            ...{
              auth: {
                ...auth7,
                installationId
              }
            }
          });
        }
      });
      octokit2.hook.before("request", (options2) => {
        options2.headers["x-github-delivery"] = event.id;
      });
      return {
        ...event,
        octokit: octokit2
      };
    }
  });
}
async function getInstallationOctokit(app, installationId) {
  return app.octokit.auth({
    type: "installation",
    installationId,
    factory(auth7) {
      const options = {
        ...auth7.octokitOptions,
        authStrategy: createAppAuth,
        ...{ auth: { ...auth7, installationId } }
      };
      return new auth7.octokit.constructor(options);
    }
  });
}
function eachInstallationFactory(app) {
  return Object.assign(eachInstallation.bind(null, app), {
    iterator: eachInstallationIterator.bind(null, app)
  });
}
async function eachInstallation(app, callback) {
  const i = eachInstallationIterator(app)[Symbol.asyncIterator]();
  let result = await i.next();
  while (!result.done) {
    await callback(result.value);
    result = await i.next();
  }
}
function eachInstallationIterator(app) {
  return {
    async *[Symbol.asyncIterator]() {
      const iterator2 = composePaginateRest.iterator(
        app.octokit,
        "GET /app/installations"
      );
      for await (const { data: installations } of iterator2) {
        for (const installation of installations) {
          const installationOctokit = await getInstallationOctokit(
            app,
            installation.id
          );
          yield { octokit: installationOctokit, installation };
        }
      }
    }
  };
}
function eachRepositoryFactory(app) {
  return Object.assign(eachRepository.bind(null, app), {
    iterator: eachRepositoryIterator.bind(null, app)
  });
}
async function eachRepository(app, queryOrCallback, callback) {
  const i = eachRepositoryIterator(
    app,
    callback ? queryOrCallback : void 0
  )[Symbol.asyncIterator]();
  let result = await i.next();
  while (!result.done) {
    if (callback) {
      await callback(result.value);
    } else {
      await queryOrCallback(result.value);
    }
    result = await i.next();
  }
}
function singleInstallationIterator(app, installationId) {
  return {
    async *[Symbol.asyncIterator]() {
      yield {
        octokit: await app.getInstallationOctokit(installationId)
      };
    }
  };
}
function eachRepositoryIterator(app, query) {
  return {
    async *[Symbol.asyncIterator]() {
      const iterator2 = query ? singleInstallationIterator(app, query.installationId) : app.eachInstallation.iterator();
      for await (const { octokit: octokit2 } of iterator2) {
        const repositoriesIterator = composePaginateRest.iterator(
          octokit2,
          "GET /installation/repositories"
        );
        for await (const { data: repositories } of repositoriesIterator) {
          for (const repository of repositories) {
            yield { octokit: octokit2, repository };
          }
        }
      }
    }
  };
}
function getInstallationUrlFactory(app) {
  let installationUrlBasePromise;
  return async function getInstallationUrl(options = {}) {
    if (!installationUrlBasePromise) {
      installationUrlBasePromise = getInstallationUrlBase(app);
    }
    const installationUrlBase = await installationUrlBasePromise;
    const installationUrl = new URL(installationUrlBase);
    if (options.target_id !== void 0) {
      installationUrl.pathname += "/permissions";
      installationUrl.searchParams.append(
        "target_id",
        options.target_id.toFixed()
      );
    }
    if (options.state !== void 0) {
      installationUrl.searchParams.append("state", options.state);
    }
    return installationUrl.href;
  };
}
async function getInstallationUrlBase(app) {
  const { data: appInfo } = await app.octokit.request("GET /app");
  if (!appInfo) {
    throw new Error("[@octokit/app] unable to fetch metadata for app");
  }
  return `${appInfo.html_url}/installations/new`;
}
var App = class {
  static VERSION = VERSION15;
  static defaults(defaults) {
    const AppWithDefaults = class extends this {
      constructor(...args) {
        super({
          ...defaults,
          ...args[0]
        });
      }
    };
    return AppWithDefaults;
  }
  octokit;
  // @ts-ignore calling app.webhooks will throw a helpful error when options.webhooks is not set
  webhooks;
  // @ts-ignore calling app.oauth will throw a helpful error when options.oauth is not set
  oauth;
  getInstallationOctokit;
  eachInstallation;
  eachRepository;
  getInstallationUrl;
  log;
  constructor(options) {
    const Octokit3 = options.Octokit || Octokit;
    const authOptions = Object.assign(
      {
        appId: options.appId,
        privateKey: options.privateKey
      },
      options.oauth ? {
        clientId: options.oauth.clientId,
        clientSecret: options.oauth.clientSecret
      } : {}
    );
    const octokitOptions = {
      authStrategy: createAppAuth,
      auth: authOptions
    };
    if ("log" in options && typeof options.log !== "undefined") {
      octokitOptions.log = options.log;
    }
    this.octokit = new Octokit3(octokitOptions);
    this.log = Object.assign(
      {
        debug: () => {
        },
        info: () => {
        },
        warn: console.warn.bind(console),
        error: console.error.bind(console)
      },
      options.log
    );
    if (options.webhooks) {
      this.webhooks = webhooks(this.octokit, options.webhooks);
    } else {
      Object.defineProperty(this, "webhooks", {
        get() {
          throw new Error("[@octokit/app] webhooks option not set");
        }
      });
    }
    if (options.oauth) {
      this.oauth = new OAuthApp({
        ...options.oauth,
        clientType: "github-app",
        Octokit: Octokit3
      });
    } else {
      Object.defineProperty(this, "oauth", {
        get() {
          throw new Error(
            "[@octokit/app] oauth.clientId / oauth.clientSecret options are not set"
          );
        }
      });
    }
    this.getInstallationOctokit = getInstallationOctokit.bind(
      null,
      this
    );
    this.eachInstallation = eachInstallationFactory(
      this
    );
    this.eachRepository = eachRepositoryFactory(
      this
    );
    this.getInstallationUrl = getInstallationUrlFactory(this);
  }
};

// node_modules/octokit/dist-bundle/index.js
var VERSION16 = "0.0.0-development";
var Octokit2 = Octokit.plugin(
  restEndpointMethods,
  paginateRest,
  paginateGraphQL,
  retry,
  throttling
).defaults({
  userAgent: `octokit.js/${VERSION16}`,
  throttle: {
    onRateLimit,
    onSecondaryRateLimit
  }
});
function onRateLimit(retryAfter, options, octokit2) {
  octokit2.log.warn(
    `Request quota exhausted for request ${options.method} ${options.url}`
  );
  if (options.request.retryCount === 0) {
    octokit2.log.info(`Retrying after ${retryAfter} seconds!`);
    return true;
  }
}
function onSecondaryRateLimit(retryAfter, options, octokit2) {
  octokit2.log.warn(
    `SecondaryRateLimit detected for request ${options.method} ${options.url}`
  );
  if (options.request.retryCount === 0) {
    octokit2.log.info(`Retrying after ${retryAfter} seconds!`);
    return true;
  }
}
var App2 = App.defaults({ Octokit: Octokit2 });
var OAuthApp2 = OAuthApp.defaults({ Octokit: Octokit2 });

// scripts/util/parse-owner-repo.ts
init_esm_shims();
function parseOwnerRepo(urlOrSlug) {
  const trimmed = urlOrSlug.trim().replace(/\.git$/, "");
  if (trimmed.includes("/")) {
    const slugMatch = trimmed.match(/github\.com[/:]([^/]+)\/([^/]+)/);
    if (slugMatch) {
      return { owner: slugMatch[1], repo: slugMatch[2] };
    }
    const parts = trimmed.split("/");
    if (parts.length >= 2) {
      return {
        owner: parts[parts.length - 2],
        repo: parts[parts.length - 1]
      };
    }
  }
  throw new Error(`Invalid GitHub repo reference: ${urlOrSlug}`);
}
function formatOwnerRepo(owner, repo) {
  return `${owner}/${repo}`;
}

// scripts/github/repo.ts
var GitHubRepoError = class extends Error {
  status;
  constructor(message, status) {
    super(message);
    this.name = "GitHubRepoError";
    this.status = status;
  }
};
async function newContext() {
  const token = await resolveGitHubToken();
  return { octokit: new Octokit2({ auth: token }) };
}
function wrap(err, context) {
  if (err instanceof RequestError) {
    throw new GitHubRepoError(`${context}: ${err.message}`, err.status);
  }
  if (err instanceof Error) {
    throw new GitHubRepoError(`${context}: ${err.message}`);
  }
  throw new GitHubRepoError(context);
}
async function getLogin(ctx) {
  if (!ctx.loginPromise) {
    ctx.loginPromise = ctx.octokit.rest.users.getAuthenticated().then(({ data }) => data.login);
  }
  return ctx.loginPromise;
}
async function getCurrentUser() {
  try {
    const ctx = await newContext();
    return await getLogin(ctx);
  } catch (err) {
    wrap(err, "GitHub authentication failed");
  }
}
async function createRepo(name, opts = {}) {
  try {
    const ctx = await newContext();
    const isPrivate = opts.private !== false;
    const description = opts.description;
    if (name.includes("/")) {
      const { owner, repo } = parseOwnerRepo(name);
      const login = await getLogin(ctx);
      let data2;
      if (owner.toLowerCase() === login.toLowerCase()) {
        ({ data: data2 } = await ctx.octokit.rest.repos.createForAuthenticatedUser({
          name: repo,
          private: isPrivate,
          description
        }));
      } else {
        ({ data: data2 } = await ctx.octokit.rest.repos.createInOrg({
          org: owner,
          name: repo,
          private: isPrivate,
          description
        }));
      }
      return data2.html_url || `https://github.com/${formatOwnerRepo(owner, repo)}`;
    }
    const { data } = await ctx.octokit.rest.repos.createForAuthenticatedUser({
      name,
      private: isPrivate,
      description
    });
    return data.html_url || `https://github.com/${data.full_name}`;
  } catch (err) {
    wrap(err, `Failed to create repository "${name}"`);
  }
}
async function deleteRepo(name) {
  try {
    const { owner, repo } = parseOwnerRepo(name);
    const ctx = await newContext();
    await ctx.octokit.rest.repos.delete({ owner, repo });
  } catch (err) {
    wrap(err, `Failed to delete repository "${name}"`);
  }
}
async function repoExists(name) {
  try {
    const { owner, repo } = parseOwnerRepo(name);
    const ctx = await newContext();
    await ctx.octokit.rest.repos.get({ owner, repo });
    return true;
  } catch (err) {
    if (err instanceof RequestError && err.status === 404) return false;
    wrap(err, `Failed to check repository "${name}"`);
  }
}
async function getActionsEnabled(ownerRepo) {
  try {
    const { owner, repo } = parseOwnerRepo(ownerRepo);
    const ctx = await newContext();
    const { data } = await ctx.octokit.rest.actions.getGithubActionsPermissionsRepository({ owner, repo });
    return data.enabled;
  } catch {
    return void 0;
  }
}
async function getRepoFullName(name) {
  try {
    const { owner, repo } = parseOwnerRepo(name);
    const ctx = await newContext();
    const { data } = await ctx.octokit.rest.repos.get({ owner, repo });
    return data.full_name || formatOwnerRepo(owner, repo);
  } catch (err) {
    wrap(err, `Repository "${name}" is not visible`);
  }
}

// scripts/github/runner.ts
init_esm_shims();
var GitHubRunnerError = class extends Error {
  status;
  constructor(message, status) {
    super(message);
    this.name = "GitHubRunnerError";
    this.status = status;
  }
};
async function getOctokit() {
  const token = await resolveGitHubToken();
  return new Octokit2({ auth: token });
}
function wrap2(err, context) {
  if (err instanceof RequestError) {
    throw new GitHubRunnerError(`${context}: ${err.message}`, err.status);
  }
  if (err instanceof Error) {
    throw new GitHubRunnerError(`${context}: ${err.message}`);
  }
  throw new GitHubRunnerError(context);
}
async function createRegistrationToken(ownerRepo) {
  try {
    const { owner, repo } = parseOwnerRepo(ownerRepo);
    const octokit2 = await getOctokit();
    const { data } = await octokit2.rest.actions.createRegistrationTokenForRepo({ owner, repo });
    if (!data.token) {
      throw new GitHubRunnerError("Registration token missing from GitHub response");
    }
    return data.token;
  } catch (err) {
    if (err instanceof GitHubRunnerError) throw err;
    if (err instanceof RequestError && err.status === 404) {
      throw new GitHubRunnerError(
        `GitHub returned 404 for "${ownerRepo}". The signed-in user can't see this repo \u2013 it's likely private and owned by a different account. Sign in to GitHub as the repo owner (or set GITHUB_TOKEN to a token with access) and retry.`,
        404
      );
    }
    wrap2(err, "Failed to create runner registration token");
  }
}
async function listRepoRunners(ownerRepo) {
  try {
    const { owner, repo } = parseOwnerRepo(ownerRepo);
    const octokit2 = await getOctokit();
    const { data } = await octokit2.rest.actions.listSelfHostedRunnersForRepo({ owner, repo });
    return (data.runners ?? []).map((r) => ({
      id: r.id,
      name: r.name,
      status: r.status
    }));
  } catch (err) {
    wrap2(err, `Failed to list runners for "${ownerRepo}"`);
  }
}
async function getRunnerIdByName(ownerRepo, runnerName2) {
  const runners = await listRepoRunners(ownerRepo);
  return runners.find((r) => r.name === runnerName2)?.id;
}
async function getRunnerStatus(ownerRepo, runnerName2) {
  const runners = await listRepoRunners(ownerRepo);
  return runners.find((r) => r.name === runnerName2)?.status;
}
async function deleteRunner(ownerRepo, runnerId) {
  try {
    const { owner, repo } = parseOwnerRepo(ownerRepo);
    const octokit2 = await getOctokit();
    await octokit2.rest.actions.deleteSelfHostedRunnerFromRepo({ owner, repo, runner_id: runnerId });
  } catch {
  }
}

// scripts/github/secrets.ts
init_esm_shims();
import sodium from "tweetsodium";
var GitHubSecretsError = class extends Error {
  status;
  constructor(message, status) {
    super(message);
    this.name = "GitHubSecretsError";
    this.status = status;
  }
};
async function getOctokit2() {
  const token = await resolveGitHubToken();
  return new Octokit2({ auth: token });
}
function wrap3(err, context) {
  if (err instanceof RequestError) {
    throw new GitHubSecretsError(`${context}: ${err.message}`, err.status);
  }
  if (err instanceof Error) {
    throw new GitHubSecretsError(`${context}: ${err.message}`);
  }
  throw new GitHubSecretsError(context);
}
function encryptSecret(publicKey, secretValue) {
  const keyBytes = Buffer.from(publicKey, "base64");
  const messageBytes = Buffer.from(secretValue);
  const encryptedBytes = sodium.seal(messageBytes, keyBytes);
  return Buffer.from(encryptedBytes).toString("base64");
}
async function setRepoSecret(ownerRepo, secretName, secretValue) {
  try {
    const { owner, repo } = parseOwnerRepo(ownerRepo);
    const octokit2 = await getOctokit2();
    const { data: keyData } = await octokit2.rest.actions.getRepoPublicKey({ owner, repo });
    const encryptedValue = encryptSecret(keyData.key, secretValue);
    await octokit2.rest.actions.createOrUpdateRepoSecret({
      owner,
      repo,
      secret_name: secretName,
      encrypted_value: encryptedValue,
      key_id: keyData.key_id
    });
  } catch (err) {
    if (err instanceof GitHubSecretsError) throw err;
    wrap3(err, `Failed to set secret ${secretName} on ${ownerRepo}`);
  }
}
async function setRepoSecrets(ownerRepo, secrets) {
  for (const [name, value] of Object.entries(secrets)) {
    if (!value) {
      throw new GitHubSecretsError(`Missing value for secret ${name}`);
    }
  }
  for (const [name, value] of Object.entries(secrets)) {
    await setRepoSecret(ownerRepo, name, value);
  }
}
async function listSecretNames(ownerRepo) {
  try {
    const { owner, repo } = parseOwnerRepo(ownerRepo);
    const octokit2 = await getOctokit2();
    const { data } = await octokit2.rest.actions.listRepoSecrets({ owner, repo });
    return data.secrets.map((s) => s.name);
  } catch {
    return [];
  }
}

// scripts/github/pr.ts
init_esm_shims();

// scripts/lakebase/branch-delete.ts
init_esm_shims();

// scripts/lakebase/branch-utils.ts
init_esm_shims();

// scripts/lakebase/databricks-cli.ts
init_esm_shims();
import { execFile, execFileSync as execFileSync3 } from "child_process";
import { promisify } from "util";
import { join as join2 } from "path";

// scripts/lakebase/kit-config.ts
init_esm_shims();
function intFromEnv(name, fallback) {
  const raw = process.env[name];
  if (!raw) return fallback;
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return parsed;
}
var DAY_MS = 24 * 60 * 60 * 1e3;
var KIT_TIMEOUTS = {
  cliDefault: intFromEnv("LAKEBASE_KIT_TIMEOUT_CLI_DEFAULT_MS", 3e4),
  cliCreateProject: intFromEnv("LAKEBASE_KIT_TIMEOUT_CLI_CREATE_PROJECT_MS", 18e4),
  cliCreateBranch: intFromEnv("LAKEBASE_KIT_TIMEOUT_CLI_CREATE_BRANCH_MS", 6e4),
  cliCreateEndpoint: intFromEnv("LAKEBASE_KIT_TIMEOUT_CLI_CREATE_ENDPOINT_MS", 6e4),
  readyWait: intFromEnv("LAKEBASE_KIT_TIMEOUT_READY_WAIT_MS", 12e4),
  readyPoll: intFromEnv("LAKEBASE_KIT_TIMEOUT_READY_POLL_MS", 5e3),
  pgConnect: intFromEnv("LAKEBASE_KIT_TIMEOUT_PG_CONNECT_MS", 1e4),
  pgStatement: intFromEnv("LAKEBASE_KIT_TIMEOUT_PG_STATEMENT_MS", 15e3),
  gitDefault: intFromEnv("LAKEBASE_KIT_TIMEOUT_GIT_DEFAULT_MS", 5e3),
  gitCheckout: intFromEnv("LAKEBASE_KIT_TIMEOUT_GIT_CHECKOUT_MS", 1e4),
  gitNetwork: intFromEnv("LAKEBASE_KIT_TIMEOUT_GIT_NETWORK_MS", 15e3),
  gitPush: intFromEnv("LAKEBASE_KIT_TIMEOUT_GIT_PUSH_MS", 3e4),
  cliLong: intFromEnv("LAKEBASE_KIT_TIMEOUT_CLI_LONG_MS", 6e4),
  cmdShort: intFromEnv("LAKEBASE_KIT_TIMEOUT_CMD_SHORT_MS", 5e3),
  initializrCacheTtl: intFromEnv("LAKEBASE_KIT_INITIALIZR_CACHE_TTL_MS", 10 * 60 * 1e3),
  featureBranchTtlMs: intFromEnv("LAKEBASE_KIT_FEATURE_BRANCH_TTL_MS", 30 * DAY_MS),
  testBranchTtlMs: intFromEnv("LAKEBASE_KIT_TEST_BRANCH_TTL_MS", 14 * DAY_MS),
  uatBranchTtlMs: intFromEnv("LAKEBASE_KIT_UAT_BRANCH_TTL_MS", 14 * DAY_MS),
  perfBranchTtlMs: intFromEnv("LAKEBASE_KIT_PERF_BRANCH_TTL_MS", 7 * DAY_MS)
};
function formatLakebaseTtl(ms) {
  return `${Math.floor(ms / 1e3)}s`;
}
function urlFromEnv(name, fallback) {
  const raw = process.env[name];
  if (!raw) return fallback;
  return raw.replace(/\/+$/, "");
}
var KIT_REGISTRIES = {
  mavenCentral: urlFromEnv("LAKEBASE_KIT_REGISTRY_MAVEN_CENTRAL", "https://repo1.maven.org/maven2"),
  springInitializr: urlFromEnv("LAKEBASE_KIT_REGISTRY_SPRING_INITIALIZR", "https://start.spring.io")
};

// scripts/lakebase/databricks-profile.ts
init_esm_shims();
import * as fs from "fs";
import { execFileSync as execFileSync2 } from "child_process";

// scripts/util/exec.ts
init_esm_shims();
import * as cp from "child_process";
function shq(s) {
  return `'${s.replace(/'/g, "'\\''")}'`;
}
function exec2(command, opts = {}) {
  return new Promise((resolve2, reject) => {
    const options = {
      cwd: opts.cwd,
      timeout: opts.timeout ?? 6e4
    };
    if (opts.env) {
      options.env = { ...process.env, ...opts.env };
    }
    cp.exec(command, options, (err, stdout, stderr) => {
      if (err) {
        const msg = String(stderr || err.message);
        reject(new Error(`${command}: ${msg}`));
        return;
      }
      resolve2(String(stdout).trim());
    });
  });
}

// scripts/lakebase/databricks-profile.ts
function normalizeHost(host) {
  return host.trim().replace(/\/+$/, "").toLowerCase();
}
function selectProfileForHost(profilesJson, host) {
  const target = normalizeHost(host);
  if (!target) return void 0;
  const start = profilesJson.indexOf("{");
  if (start < 0) return void 0;
  let parsed;
  try {
    parsed = JSON.parse(profilesJson.slice(start));
  } catch {
    return void 0;
  }
  const profiles = parsed.profiles;
  if (!Array.isArray(profiles)) return void 0;
  const names = profiles.filter((p) => {
    if (!p || typeof p !== "object") return false;
    const rec = p;
    return typeof rec.name === "string" && typeof rec.host === "string" && rec.valid === true && normalizeHost(rec.host) === target;
  }).map((p) => p.name);
  const distinct = Array.from(new Set(names));
  return distinct.length === 1 ? distinct[0] : void 0;
}
async function resolveProfileForHost(host, timeoutMs = KIT_TIMEOUTS.cliDefault) {
  if (!normalizeHost(host)) return void 0;
  let out;
  try {
    out = await exec2("databricks auth profiles -o json", { timeout: timeoutMs });
  } catch {
    return void 0;
  }
  return selectProfileForHost(out, host);
}
function resolveProfileForHostSync(host, timeoutMs = KIT_TIMEOUTS.cliDefault) {
  if (!normalizeHost(host)) return void 0;
  let out;
  try {
    out = execFileSync2("databricks", ["auth", "profiles", "-o", "json"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      timeout: timeoutMs
    });
  } catch {
    return void 0;
  }
  return selectProfileForHost(out, host);
}
async function ensureProfilePinned(args) {
  const { envPath } = args;
  if (!fs.existsSync(envPath)) return { reason: "no-env" };
  const lines = fs.readFileSync(envPath, "utf-8").split("\n");
  const startsWithKey = (line, key) => line.trimStart().startsWith(`${key}=`);
  if (lines.some((l) => startsWithKey(l, "DATABRICKS_CONFIG_PROFILE"))) {
    return { reason: "already-pinned" };
  }
  const hostIdx = lines.findIndex((l) => startsWithKey(l, "DATABRICKS_HOST"));
  if (hostIdx < 0) return { reason: "no-host" };
  const hostLine = lines[hostIdx];
  const host = hostLine.slice(hostLine.indexOf("=") + 1).trim();
  if (!host) return { reason: "no-host" };
  const resolve2 = args.resolve ?? ((h) => resolveProfileForHost(h));
  const profile = await resolve2(host);
  if (!profile) return { reason: "no-match" };
  lines.splice(hostIdx + 1, 0, `DATABRICKS_CONFIG_PROFILE=${profile}`);
  fs.writeFileSync(envPath, lines.join("\n"));
  return { pinned: profile };
}

// scripts/lakebase/env-file.ts
init_esm_shims();
import * as fs2 from "fs";
import * as path2 from "path";
function readEnvVar(envPath, key) {
  if (!fs2.existsSync(envPath)) return void 0;
  let value;
  for (const line of fs2.readFileSync(envPath, "utf-8").split("\n")) {
    const trimmed = line.trimStart();
    if (trimmed.startsWith("#") || !trimmed.startsWith(`${key}=`)) continue;
    value = trimmed.slice(key.length + 1).trim().replace(/^["']|["']$/g, "");
  }
  return value && value.length > 0 ? value : void 0;
}
function writeEnvFile(args) {
  const host = args.databricksHost.replace(/\/+$/, "");
  const envContent = [
    "# Lakebase project configuration",
    "# Created by @databricks-solutions/lakebase-scm-utils",
    "",
    `DATABRICKS_HOST=${host}`,
    `LAKEBASE_PROJECT_ID=${args.lakebaseProjectId}`,
    "",
    "# Connection METADATA (auto-populated on branch switch). No DB token is",
    "# stored here: the app + migrations mint a short-lived Lakebase credential",
    "# at runtime from this metadata (endpoint projects/<id>/branches/<branch>/",
    "# endpoints/<endpoint>). Set DATABASE_URL explicitly to override (CI/Docker).",
    "# LAKEBASE_BRANCH_ID=",
    "# LAKEBASE_HOST=",
    "# LAKEBASE_ENDPOINT=primary",
    "# DB_USERNAME=",
    ""
  ].join("\n");
  const envPath = path2.join(args.projectDir, ".env");
  fs2.writeFileSync(envPath, envContent);
  return envPath;
}
var CONNECTION_KEYS = [
  "DATABASE_URL",
  "DB_PASSWORD",
  "DB_USERNAME",
  "LAKEBASE_PROJECT_ID",
  "LAKEBASE_BRANCH_ID",
  "LAKEBASE_HOST",
  "LAKEBASE_ENDPOINT"
];
function updateEnvConnection(args) {
  const existing = fs2.existsSync(args.envPath) ? fs2.readFileSync(args.envPath, "utf-8") : "";
  const preserved = existing.split("\n").filter((line) => {
    const trimmed = line.trimStart();
    return !CONNECTION_KEYS.some((k) => trimmed.startsWith(`${k}=`));
  }).join("\n").replace(/\n+$/, "");
  const lines = [];
  if (args.comment !== void 0) {
    lines.push(args.comment);
  }
  lines.push(`LAKEBASE_PROJECT_ID=${args.projectId}`);
  if (args.endpointHost !== void 0) {
    lines.push(`LAKEBASE_HOST=${args.endpointHost}`);
  }
  lines.push(`LAKEBASE_BRANCH_ID=${args.branchId}`);
  lines.push(`LAKEBASE_ENDPOINT=${args.endpoint ?? "primary"}`);
  lines.push(`DB_USERNAME=${args.username}`);
  lines.push("");
  const block = lines.join("\n");
  const content = preserved ? `${preserved}
${block}` : block;
  fs2.mkdirSync(path2.dirname(args.envPath), { recursive: true });
  fs2.writeFileSync(args.envPath, content);
}

// scripts/lakebase/databricks-cli.ts
var execFileP = promisify(execFile);
var DatabricksCliError = class extends Error {
  constructor(message, profile, stderr) {
    super(message);
    this.profile = profile;
    this.stderr = stderr;
    this.name = "DatabricksCliError";
  }
  profile;
  stderr;
};
var DatabricksAuthError = class extends DatabricksCliError {
  constructor(profile, detail) {
    const login = `databricks auth login${profile ? ` --profile ${profile}` : ""}`;
    super(
      `Databricks authentication failed${profile ? ` for profile "${profile}"` : ""}: the cached token is missing or expired. Re-authenticate, then re-run:
  ${login}
${detail}`,
      profile,
      detail
    );
    this.name = "DatabricksAuthError";
  }
};
var profileByHost = /* @__PURE__ */ new Map();
var profileByEnvFile = /* @__PURE__ */ new Map();
var hostByEnvFile = /* @__PURE__ */ new Map();
function envFileHost(cwd) {
  if (hostByEnvFile.has(cwd)) return hostByEnvFile.get(cwd);
  const v = readEnvVar(join2(cwd, ".env"), "DATABRICKS_HOST");
  hostByEnvFile.set(cwd, v);
  return v;
}
function effectiveHost(opts) {
  const base = opts.env ?? process.env;
  const cwd = opts.cwd ?? process.cwd();
  const h = opts.host ?? base.DATABRICKS_HOST ?? envFileHost(cwd);
  return h?.trim() || void 0;
}
function isAuthFailure(text) {
  return /refresh token is invalid|auth login|could not be retrieved because|not authenticated|no valid.*(credential|token)|invalid.*(access token|credential)|\b401\b|unauthorized/i.test(
    text
  );
}
function resolveProfile(opts) {
  const base = opts.env ?? process.env;
  if (opts.profile) return opts.profile;
  const envProfile = base.DATABRICKS_CONFIG_PROFILE?.trim();
  if (envProfile) return envProfile;
  const cwd = opts.cwd ?? process.cwd();
  let fromEnvFile;
  if (profileByEnvFile.has(cwd)) {
    fromEnvFile = profileByEnvFile.get(cwd);
  } else {
    fromEnvFile = readEnvVar(join2(cwd, ".env"), "DATABRICKS_CONFIG_PROFILE");
    profileByEnvFile.set(cwd, fromEnvFile);
  }
  if (fromEnvFile) return fromEnvFile;
  const host = effectiveHost(opts);
  if (!host) return void 0;
  if (profileByHost.has(host)) return profileByHost.get(host);
  const resolved = resolveProfileForHostSync(host, opts.timeout);
  profileByHost.set(host, resolved);
  return resolved;
}
function buildInvocation(args, opts) {
  const base = opts.env ?? process.env;
  const trimmedHost = effectiveHost(opts)?.replace(/\/+$/, "");
  const env = trimmedHost ? { ...base, DATABRICKS_HOST: trimmedHost } : base;
  const profile = resolveProfile(opts);
  const argv = profile && !opts.noProfile && !args.includes("--profile") ? [...args, "--profile", profile] : args;
  return { argv, env, profile };
}
function classifyDatabricksError(err, argv, profile) {
  const e = err;
  const asText = (v) => typeof v === "string" ? v : Buffer.isBuffer(v) ? v.toString("utf8") : "";
  const stderr = asText(e.stderr).trim();
  const stdout = asText(e.stdout).trim();
  const haystack = `${e.message ?? ""}
${stderr}
${stdout}`;
  if (isAuthFailure(haystack)) {
    return new DatabricksAuthError(profile, stderr || stdout || (e.message ?? ""));
  }
  const killed = e.killed === true;
  const signal = e.signal ?? void 0;
  const detail = stderr ? `
stderr: ${stderr}` : stdout ? `
stdout: ${stdout}` : killed || signal ? `
(no output; the CLI was killed${signal ? ` by ${signal}` : ""}, likely a TIMEOUT; raise the budget via the matching LAKEBASE_KIT_TIMEOUT_* env var)` : e.code !== void 0 ? `
(no stderr/stdout; exit ${e.code})` : "";
  return new DatabricksCliError(
    `databricks ${argv.join(" ")} failed: ${e.message}${detail}`,
    profile,
    stderr || stdout
  );
}
async function runDatabricks(args, opts = {}) {
  const { argv, env, profile } = buildInvocation(args, opts);
  try {
    const { stdout } = await execFileP("databricks", argv, {
      env,
      timeout: opts.timeout ?? KIT_TIMEOUTS.cliDefault
    });
    return stdout.toString();
  } catch (err) {
    throw classifyDatabricksError(err, argv, profile);
  }
}
function runDatabricksSync(args, opts = {}) {
  const { argv, env, profile } = buildInvocation(args, opts);
  try {
    return execFileSync3("databricks", argv, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      env,
      timeout: opts.timeout ?? KIT_TIMEOUTS.cliDefault
    });
  } catch (err) {
    throw classifyDatabricksError(err, argv, profile);
  }
}

// scripts/lakebase/branch-id.ts
init_esm_shims();
var UID_PATTERN = /^br-[a-z0-9-]+$/;
function looksLikeBranchUid(s) {
  return UID_PATTERN.test(s);
}
function asBranchName(s) {
  if (!s) throw new TypeError("BranchName cannot be empty");
  if (looksLikeBranchUid(s)) {
    throw new TypeError(
      `'${s}' looks like a BranchUid (br-\u2026 pattern), not a BranchName. BranchName is the resource-path leaf (e.g. 'production', 'staging', 'feature-add-orders'); BranchUid is the system identifier returned by list-branches as the 'uid' field. The Lakebase API rejects a BranchUid in any path-shaped field. If you really mean a BranchUid, use asBranchUid() instead \u2013 but verify you're calling a function that takes one.`
    );
  }
  return s;
}
function asBranchUid(s) {
  if (!s) throw new TypeError("BranchUid cannot be empty");
  if (!looksLikeBranchUid(s)) {
    throw new TypeError(
      `'${s}' is not a BranchUid (must match the br-\u2026 pattern). If you have a BranchName (resource-path leaf like 'production'), use asBranchName() instead.`
    );
  }
  return s;
}
function branchNameFromResourcePath(path33) {
  if (!path33.includes("/branches/")) return null;
  const leaf = path33.split("/branches/").pop();
  if (!leaf) return null;
  try {
    return asBranchName(leaf);
  } catch {
    return null;
  }
}

// scripts/git/inspect.ts
init_esm_shims();
async function getCurrentBranch(args) {
  try {
    const name = await exec2("git rev-parse --abbrev-ref HEAD", {
      cwd: args.cwd
    });
    return name === "HEAD" ? "" : name;
  } catch {
    return "";
  }
}
async function getRepoRoot(args) {
  try {
    return await exec2("git rev-parse --show-toplevel", { cwd: args.cwd });
  } catch {
    return "";
  }
}
async function getFileAtRef(args) {
  try {
    return await exec2(
      `git show ${shq(`${args.ref}:${args.filePath}`)}`,
      { cwd: args.cwd }
    );
  } catch {
    return "";
  }
}
async function gitBranchExists(args) {
  if (!args.branch) return false;
  for (const ref of [`refs/heads/${args.branch}`, `refs/remotes/origin/${args.branch}`]) {
    try {
      await exec2(`git rev-parse --verify --quiet ${shq(ref)}`, { cwd: args.cwd });
      return true;
    } catch {
    }
  }
  return false;
}
async function resolveDefaultBranch(args) {
  try {
    const ref = await exec2("git rev-parse --abbrev-ref origin/HEAD", { cwd: args.cwd });
    const name = ref.replace(/^origin\//, "").trim();
    if (name && name !== "HEAD") return name;
  } catch {
  }
  for (const cand of ["main", "master"]) {
    if (await gitBranchExists({ cwd: args.cwd, branch: cand })) return cand;
  }
  return "main";
}
async function listTags(args) {
  try {
    const raw = await exec2("git tag -l", { cwd: args.cwd });
    return raw ? raw.split("\n").filter(Boolean) : [];
  } catch {
    return [];
  }
}

// scripts/lakebase/branch-utils.ts
var LakebaseBranchError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "LakebaseBranchError";
  }
};
var LakebaseBranchTtlTooLongError = class extends LakebaseBranchError {
  /** The TTL that was attempted (the value passed to the API). */
  attemptedTtl;
  constructor(attemptedTtl, underlyingMessage) {
    super(
      `Branch create rejected: TTL '${attemptedTtl}' exceeds the workspace's maximum expiration policy. Pass a shorter ttl arg (e.g. "604800s" for 7 days) or set noExpiry: true. The workspace cap is not directly exposed by the Lakebase API; the project's history_retention_duration (from \`databricks postgres get-project\`) is a conservative starting point.

Underlying error: ${underlyingMessage}`
    );
    this.name = "LakebaseBranchTtlTooLongError";
    this.attemptedTtl = attemptedTtl;
  }
};
function isTtlTooLongError(stderr) {
  return /expiration time exceeds the maximum expiration time/i.test(stderr);
}
function parseLakebaseTtl(ttl) {
  if (!ttl) return void 0;
  const m = ttl.trim().match(/^(\d+)s?$/);
  if (!m) return void 0;
  const n = Number.parseInt(m[1], 10);
  return Number.isFinite(n) && n > 0 ? n : void 0;
}
function minLakebaseTtl(a, b) {
  const sa = parseLakebaseTtl(a);
  const sb = parseLakebaseTtl(b);
  if (sa === void 0 && sb === void 0) return void 0;
  if (sa === void 0) return `${sb}s`;
  if (sb === void 0) return `${sa}s`;
  return `${Math.min(sa, sb)}s`;
}
var RETENTION_CACHE = /* @__PURE__ */ new Map();
function getCachedProjectRetention(instance) {
  return RETENTION_CACHE.get(instance);
}
function cacheProjectRetention(instance, ttl) {
  RETENTION_CACHE.set(instance, ttl);
}
function clearRetentionCache() {
  RETENTION_CACHE.clear();
}
function projectPath(instance) {
  return `projects/${instance}`;
}
async function listBranches(opts) {
  const raw = await dbcli(
    ["postgres", "list-branches", projectPath(opts.instance), "-o", "json"],
    opts.host
  );
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new LakebaseBranchError(`Unexpected CLI output: ${raw.slice(0, 200)}`);
  }
  const items = Array.isArray(parsed) ? parsed : parsed.branches ?? parsed.items ?? [];
  return items.map(parseBranch).filter((b) => b !== void 0);
}
async function getBranchByName(branchNameOrUid, opts) {
  const branches = await listBranches(opts);
  return branches.find(
    (b) => b.uid === branchNameOrUid || b.name === branchNameOrUid || b.name.endsWith(`/${branchNameOrUid}`)
  );
}
async function getDefaultBranch(opts) {
  const branches = await listBranches(opts);
  return branches.find((b) => b.isDefault);
}
function isLongRunningTierBranch(b) {
  return !b.isDefault && !b.expireTime;
}
var DEFAULT_PROTECTED_TIER_NAMES = /* @__PURE__ */ new Set([
  "main",
  "master",
  "staging",
  "dev"
]);
function normalizeTierName(name) {
  return name.trim().toLowerCase();
}
function resolveProtectedTierNames(extra) {
  const out = new Set(DEFAULT_PROTECTED_TIER_NAMES);
  for (const n of extra ?? []) {
    const k = normalizeTierName(n);
    if (k) {
      out.add(k);
    }
  }
  return out;
}
function protectedTierNamesFromEnv(env = process.env) {
  const extra = [];
  for (const part of (env.LAKEBASE_TIER_NAMES ?? "").split(",")) {
    if (part.trim()) {
      extra.push(part);
    }
  }
  for (const key of ["LAKEBASE_TRUNK_BRANCH", "LAKEBASE_STAGING_BRANCH", "LAKEBASE_BASE_BRANCH"]) {
    const v = env[key];
    if (v && v.trim()) {
      extra.push(v);
    }
  }
  return resolveProtectedTierNames(extra);
}
function isTier(name, branches, protectedNames = DEFAULT_PROTECTED_TIER_NAMES) {
  if (!name) {
    return false;
  }
  if (!protectedNames.has(normalizeTierName(name))) {
    return false;
  }
  return branches.some((b) => isLongRunningTierBranch(b) && b.nameLeaf === name);
}
function tierBranchNames(branches, protectedNames = DEFAULT_PROTECTED_TIER_NAMES) {
  return branches.filter((b) => isLongRunningTierBranch(b) && protectedNames.has(normalizeTierName(b.nameLeaf))).map((b) => b.nameLeaf);
}
var ProtectedBranchCommitError = class extends Error {
  constructor(branch) {
    super(
      `Refusing to commit build output onto protected tier branch "${branch}". Experiment/build commits must land on an experiment or feature branch, never a shared tier (main/master/staging/dev or a configured tier). This usually means the feature branch was never cut (an un-reconciled prior feature left stale SCM state). Claim/reconcile the feature, then re-run.`
    );
    this.branch = branch;
    this.name = "ProtectedBranchCommitError";
  }
  branch;
};
async function assertCommitTargetNotProtected(projectDir) {
  const current = await getCurrentBranch({ cwd: projectDir });
  if (!current) return;
  if (protectedTierNamesFromEnv().has(normalizeTierName(current))) {
    throw new ProtectedBranchCommitError(current);
  }
}
async function resolveBranchPath(branchNameOrUid, opts) {
  if (branchNameOrUid.startsWith("projects/") && branchNameOrUid.includes("/branches/")) {
    return branchNameOrUid;
  }
  const branch = await getBranchByName(branchNameOrUid, opts);
  return branch?.name;
}
async function resolveBranchId(args) {
  const { branch, ...opts } = args;
  if (branch.startsWith("projects/") && branch.includes("/branches/")) {
    const leaf2 = branch.split("/branches/").pop();
    if (leaf2) return leaf2;
  }
  if (!branch.startsWith("br-")) {
    return branch;
  }
  const info = await getBranchByName(branch, opts);
  if (!info) {
    throw new LakebaseBranchError(
      `Could not resolve branch "${branch}" in project "${opts.instance}". Pass either the branch_id (e.g. "demo-feature") or the branch uid.`
    );
  }
  const leaf = info.name.split("/branches/").pop();
  if (!leaf) {
    throw new LakebaseBranchError(
      `Branch info for "${branch}" missing a name segment (got "${info.name}").`
    );
  }
  return leaf;
}
function parseBranch(raw) {
  if (!raw || typeof raw !== "object") return void 0;
  const r = raw;
  const name = r.name ?? "";
  if (!name) return void 0;
  const nameLeaf = branchNameFromResourcePath(name);
  if (!nameLeaf) return void 0;
  if (!r.uid) return void 0;
  let uid;
  try {
    uid = asBranchUid(r.uid);
  } catch {
    return void 0;
  }
  const sourceBranchName = r.status?.source_branch ?? r.spec?.source_branch;
  const sourceBranchId = sourceBranchName ? branchNameFromResourcePath(sourceBranchName) ?? void 0 : void 0;
  return {
    uid,
    nameLeaf,
    name,
    state: r.status?.current_state ?? r.state ?? "UNKNOWN",
    sourceBranchName,
    sourceBranchId,
    isDefault: r.status?.default === true || r.is_default === true,
    expireTime: r.status?.expire_time,
    isProtected: r.status?.is_protected
  };
}
function dbcli(args, host) {
  return runDatabricks(args, { host, timeout: KIT_TIMEOUTS.cliDefault });
}

// scripts/lakebase/branch-delete.ts
async function deleteBranch(args) {
  const fullPath = await resolveBranchPath(args.branch, {
    instance: args.instance,
    host: args.host
  });
  if (!fullPath) {
    throw new LakebaseBranchError(`Branch "${args.branch}" not found in instance "${args.instance}"`);
  }
  if (!args.allowDefault) {
    const info = await getBranchByName(args.branch, {
      instance: args.instance,
      host: args.host
    });
    if (info?.isDefault) {
      const leaf = info.name.split("/branches/").pop() ?? info.uid;
      throw new LakebaseBranchError(
        `Refusing to delete the project's default Lakebase branch "${leaf}". This branch is the trunk every other branch was forked from. Pass allowDefault=true (or --allow-default on the CLI) only when you intend to tear down the entire project.`
      );
    }
  }
  await dbcli2(["postgres", "delete-branch", fullPath], args.host);
}
function dbcli2(args, host) {
  return runDatabricks(args, { host, timeout: KIT_TIMEOUTS.cliDefault });
}

// scripts/util/sanitize-branch-name.ts
init_esm_shims();
var LAKEBASE_BRANCH_NAME_MAX = 63;
function sanitizeBranchName(gitBranch) {
  let name = gitBranch.replace(/\//g, "-").toLowerCase().replace(/[^a-z0-9-]/g, "-").substring(0, LAKEBASE_BRANCH_NAME_MAX);
  while (name.length < 3) name += "-x";
  return name;
}

// scripts/github/pr.ts
var GitHubPullRequestError = class extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    this.name = "GitHubPullRequestError";
  }
  status;
};
async function octokit() {
  const token = await resolveGitHubToken();
  return new Octokit2({ auth: token });
}
function wrap4(err, context) {
  if (err instanceof RequestError) {
    throw new GitHubPullRequestError(`${context}: ${err.message}`, err.status);
  }
  if (err instanceof Error) {
    throw new GitHubPullRequestError(`${context}: ${err.message}`);
  }
  throw new GitHubPullRequestError(context);
}
async function createPullRequest(args) {
  try {
    const { owner, repo } = parseOwnerRepo(args.ownerRepo);
    const ok = await octokit();
    let base = args.baseBranch;
    if (!base) {
      const { data: repoData } = await ok.rest.repos.get({ owner, repo });
      base = repoData.default_branch || "main";
    }
    const { data } = await ok.rest.pulls.create({
      owner,
      repo,
      title: args.title,
      head: args.headBranch,
      base,
      body: args.body
    });
    return data.html_url || "";
  } catch (err) {
    wrap4(err, "Failed to create pull request");
  }
}
async function getPullRequest(ownerRepo, headBranch) {
  try {
    const { owner, repo } = parseOwnerRepo(ownerRepo);
    const ok = await octokit();
    const { data: pulls } = await ok.rest.pulls.list({
      owner,
      repo,
      state: "open",
      head: `${owner}:${headBranch}`,
      per_page: 1
    });
    if (pulls.length === 0) return void 0;
    const { data: pr } = await ok.rest.pulls.get({
      owner,
      repo,
      pull_number: pulls[0].number
    });
    if (pr.state !== "open") return void 0;
    let checks = [];
    let ciStatus = "pending";
    const headSha = pr.head?.sha;
    if (headSha) {
      try {
        const { data: checksData } = await ok.rest.checks.listForRef({
          owner,
          repo,
          ref: headSha
        });
        const runs = checksData.check_runs || [];
        checks = runs.map((c) => ({
          name: c.name || "unknown",
          status: (c.status || "").toUpperCase(),
          conclusion: (c.conclusion || "").toUpperCase(),
          detailsUrl: c.details_url || void 0
        }));
        ciStatus = parseCiStatus(runs);
      } catch {
        ciStatus = "pending";
      }
    }
    return {
      number: pr.number,
      title: pr.title,
      url: pr.html_url || "",
      state: (pr.state || "open").toUpperCase(),
      isDraft: pr.draft || false,
      ciStatus,
      checks,
      headBranch: pr.head?.ref || headBranch,
      baseBranch: pr.base?.ref || "",
      body: pr.body || void 0,
      additions: pr.additions,
      deletions: pr.deletions,
      changedFiles: pr.changed_files
    };
  } catch {
    return void 0;
  }
}
function parseCiStatus(rawChecks) {
  if (rawChecks.length === 0) return "pending";
  const latestByName = /* @__PURE__ */ new Map();
  for (const c of rawChecks) {
    latestByName.set(c.name || "unknown", c);
  }
  const states = Array.from(latestByName.values()).map(
    (c) => (c.conclusion || c.status || "").toUpperCase()
  );
  if (states.some((s) => s === "FAILURE" || s === "ERROR" || s === "ACTION_REQUIRED")) {
    return "failure";
  }
  if (states.every((s) => s === "SUCCESS" || s === "NEUTRAL" || s === "SKIPPED")) {
    return "success";
  }
  return "pending";
}
async function getPullRequestReviews(ownerRepo, pullNumber) {
  try {
    const { owner, repo } = parseOwnerRepo(ownerRepo);
    const ok = await octokit();
    const { data } = await ok.rest.pulls.listReviews({ owner, repo, pull_number: pullNumber });
    return data.map((r) => ({
      author: r.user?.login || "unknown",
      state: r.state || "COMMENTED",
      body: r.body || "",
      submittedAt: r.submitted_at || void 0
    }));
  } catch {
    return [];
  }
}
async function getPullRequestFiles(ownerRepo, pullNumber) {
  try {
    const { owner, repo } = parseOwnerRepo(ownerRepo);
    const ok = await octokit();
    const { data } = await ok.rest.pulls.listFiles({ owner, repo, pull_number: pullNumber });
    const statusMap = {
      added: "added",
      removed: "deleted",
      modified: "modified",
      renamed: "renamed"
    };
    return data.map((f) => ({
      path: f.filename || "",
      status: statusMap[(f.status || "").toLowerCase()] || "modified",
      additions: f.additions || 0,
      deletions: f.deletions || 0
    }));
  } catch {
    return [];
  }
}
async function getPullRequestComments(ownerRepo, pullNumber) {
  try {
    const { owner, repo } = parseOwnerRepo(ownerRepo);
    const ok = await octokit();
    const { data } = await ok.rest.issues.listComments({
      owner,
      repo,
      issue_number: pullNumber
    });
    return data.map((c) => ({
      author: c.user?.login || "unknown",
      body: c.body || ""
    }));
  } catch {
    return [];
  }
}
async function listIssueComments(ownerRepo, issueNumber) {
  try {
    const { owner, repo } = parseOwnerRepo(ownerRepo);
    const ok = await octokit();
    const { data } = await ok.rest.issues.listComments({
      owner,
      repo,
      issue_number: issueNumber
    });
    return data.map((c) => c.body || "").filter(Boolean);
  } catch {
    return [];
  }
}
async function mergePullRequest(args) {
  const method = args.method ?? "merge";
  const deleteRemoteBranch2 = args.deleteRemoteBranch !== false;
  try {
    const { owner, repo } = parseOwnerRepo(args.ownerRepo);
    const ok = await octokit();
    const { data } = await ok.rest.pulls.merge({
      owner,
      repo,
      pull_number: args.pullNumber,
      merge_method: method
    });
    if (deleteRemoteBranch2) {
      try {
        const pr = await ok.rest.pulls.get({ owner, repo, pull_number: args.pullNumber });
        const headRef = pr.data.head.ref;
        await ok.rest.git.deleteRef({
          owner,
          repo,
          ref: `heads/${headRef}`
        });
      } catch {
      }
    }
    return {
      message: data.message || `Merged PR #${args.pullNumber}`,
      sha: data.sha || void 0
    };
  } catch (err) {
    wrap4(err, "Failed to merge pull request");
  }
}
async function listWorkflowRuns(ownerRepo, limit = 5) {
  try {
    const { owner, repo } = parseOwnerRepo(ownerRepo);
    const ok = await octokit();
    const { data } = await ok.rest.actions.listWorkflowRunsForRepo({
      owner,
      repo,
      per_page: limit
    });
    return (data.workflow_runs || []).map((r) => ({
      id: r.id,
      name: r.name || "",
      status: r.status || "",
      conclusion: r.conclusion || "",
      branch: r.head_branch || "",
      event: r.event || "",
      headSha: r.head_sha || void 0,
      createdAt: r.created_at || void 0,
      updatedAt: r.updated_at || void 0
    }));
  } catch {
    return [];
  }
}
async function fastForwardBranch(args) {
  try {
    const { owner, repo } = parseOwnerRepo(args.ownerRepo);
    const ok = await octokit();
    let toSha;
    if (/^[a-f0-9]{40}$/i.test(args.toRef)) {
      toSha = args.toRef;
    } else {
      const { data } = await ok.rest.repos.getBranch({
        owner,
        repo,
        branch: args.toRef
      });
      toSha = data.commit.sha;
    }
    await ok.rest.git.updateRef({
      owner,
      repo,
      ref: `heads/${args.branch}`,
      sha: toSha,
      // We deliberately use a fast-forward (force=false). If `branch`
      // had diverged from `toRef`, the methodology was already broken
      // and silently overwriting that divergence would mask the bug.
      force: false
    });
  } catch (err) {
    wrap4(err, `Failed to fast-forward ${args.branch} to ${args.toRef}`);
  }
}
async function mergePairedPullRequest(args) {
  const warnings = [];
  const deleteLakebaseBranch = args.deleteLakebaseBranch !== false;
  let headBranch = "";
  try {
    const { owner, repo } = parseOwnerRepo(args.ownerRepo);
    const ok = await octokit();
    const pr = await ok.rest.pulls.get({ owner, repo, pull_number: args.pullNumber });
    headBranch = pr.data.head?.ref ?? "";
  } catch (err) {
    warnings.push(
      `Could not read PR head branch before merge: ${err instanceof Error ? err.message : String(err)}`
    );
  }
  const { message, sha: mergeCommitSha } = await mergePullRequest({
    ownerRepo: args.ownerRepo,
    pullNumber: args.pullNumber,
    method: args.method,
    deleteRemoteBranch: args.deleteRemoteBranch
  });
  let lakebaseBranchDeleted = false;
  if (deleteLakebaseBranch && headBranch) {
    const sanitized = sanitizeBranchName(headBranch);
    try {
      await deleteBranch({ instance: args.lakebaseInstance, branch: sanitized });
      lakebaseBranchDeleted = true;
    } catch (err) {
      warnings.push(
        `Lakebase branch "${sanitized}" cleanup failed (PR merge succeeded): ${err instanceof Error ? err.message : String(err)}`
      );
    }
  } else if (deleteLakebaseBranch && !headBranch) {
    warnings.push("Skipped Lakebase branch cleanup \u2013 could not resolve PR head branch name");
  }
  return { message, headBranch, lakebaseBranchDeleted, mergeCommitSha, warnings };
}

// scripts/lakebase/index.ts
init_esm_shims();

// scripts/lakebase/branch-create.ts
init_esm_shims();

// scripts/util/poll-until.ts
init_esm_shims();

// scripts/util/delay.ts
init_esm_shims();
function delay(ms) {
  return new Promise((resolve2) => setTimeout(resolve2, ms));
}

// scripts/util/poll-until.ts
async function pollUntil(args) {
  const now = args.now ?? (() => /* @__PURE__ */ new Date());
  const sleep2 = args.sleep ?? delay;
  const startedAt = now().getTime();
  let polls = 0;
  while (true) {
    const elapsedMs = now().getTime() - startedAt;
    if (elapsedMs >= args.timeoutMs && polls > 0) {
      return { outcome: "timeout", polls, elapsedMs };
    }
    polls += 1;
    const result = await args.probe({ pollIndex: polls, elapsedMs });
    const afterProbeElapsed = now().getTime() - startedAt;
    if (args.onPoll) {
      args.onPoll({ pollIndex: polls, elapsedMs: afterProbeElapsed, result });
    } else if (args.label && !result.done) {
      const seconds = Math.round(afterProbeElapsed / 1e3);
      console.log(
        `[${args.label}] still pending after ${seconds}s (poll ${polls})`
      );
    }
    if (result.done) {
      return {
        outcome: "done",
        value: result.value,
        polls,
        elapsedMs: afterProbeElapsed
      };
    }
    if (afterProbeElapsed >= args.timeoutMs) {
      return { outcome: "timeout", polls, elapsedMs: afterProbeElapsed };
    }
    await sleep2(args.intervalMs);
  }
}
async function pollUntilDefined(probe, opts) {
  return pollUntil({
    ...opts,
    probe: async (ctx) => {
      const value = await probe(ctx);
      return value === void 0 ? { done: false } : { done: true, value };
    }
  });
}

// scripts/lakebase/lakebase-project.ts
init_esm_shims();
var LakebaseProjectError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "LakebaseProjectError";
  }
};
async function createLakebaseProject(args) {
  const raw = await dbcli3(["postgres", "create-project", args.projectId, "-o", "json"], args.host, KIT_TIMEOUTS.cliCreateProject);
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new LakebaseProjectError(`Unexpected CLI output (not JSON): ${raw.slice(0, 200)}`);
  }
  const result = parsed.response ?? parsed.result ?? parsed;
  const status = result.status ?? void 0;
  return {
    uid: result.uid ?? args.projectId,
    name: result.name ?? `projects/${args.projectId}`,
    state: status?.current_state ?? result.state ?? "READY"
  };
}
async function deleteLakebaseProject(args) {
  const name = args.projectId.startsWith("projects/") ? args.projectId : `projects/${args.projectId}`;
  await dbcli3(["postgres", "delete-project", name, "-o", "json"], args.host);
}
function findDefaultBranchName(items) {
  const def = items.find((b) => b.status?.default === true || b.is_default === true);
  if (!def || !def.name) return null;
  return branchNameFromResourcePath(def.name);
}
async function getDefaultBranchName(args) {
  try {
    const raw = await dbcli3(
      ["postgres", "list-branches", `projects/${args.projectId}`, "-o", "json"],
      args.host
    );
    const parsed = JSON.parse(raw);
    const items = Array.isArray(parsed) ? parsed : parsed.branches ?? parsed.items ?? [];
    return findDefaultBranchName(items);
  } catch {
    return null;
  }
}
async function getDefaultBranchId(args) {
  const name = await getDefaultBranchName(args);
  return name ?? "";
}
async function getProjectInfo(args) {
  const name = args.projectId.startsWith("projects/") ? args.projectId : `projects/${args.projectId}`;
  let raw;
  try {
    raw = await dbcli3(["postgres", "get-project", name, "-o", "json"], args.host);
  } catch {
    return void 0;
  }
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return void 0;
  }
  const status = parsed.status ?? void 0;
  return {
    uid: parsed.uid ?? args.projectId,
    name: parsed.name ?? name,
    displayName: parsed.display_name ?? parsed.displayName ?? void 0,
    state: status?.current_state ?? parsed.state ?? void 0
  };
}
function findHistoryRetentionDuration(parsed) {
  const raw = parsed.history_retention_duration ?? parsed.historyRetentionDuration;
  if (!raw || typeof raw !== "string") return void 0;
  const m = raw.trim().match(/^(\d+)s?$/);
  if (!m) return void 0;
  const seconds = Number.parseInt(m[1], 10);
  if (!Number.isFinite(seconds) || seconds <= 0) return void 0;
  return `${seconds}s`;
}
async function getProjectRetentionDuration(args) {
  const name = args.projectId.startsWith("projects/") ? args.projectId : `projects/${args.projectId}`;
  let raw;
  try {
    raw = await dbcli3(["postgres", "get-project", name, "-o", "json"], args.host);
  } catch {
    return void 0;
  }
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return void 0;
  }
  return findHistoryRetentionDuration(parsed);
}
function dbcli3(args, host, timeout = KIT_TIMEOUTS.cliDefault) {
  return runDatabricks(args, { host, timeout });
}

// scripts/lakebase/branch-create.ts
async function createBranch(args) {
  const sanitized = sanitizeBranchName(args.branch);
  const lookup = { instance: args.instance, host: args.host };
  let sourceBranchPath;
  if (args.parentBranch) {
    if (looksLikeBranchUid(args.parentBranch)) {
      throw new LakebaseBranchError(
        `parentBranch '${args.parentBranch}' looks like a BranchUid (br-\u2026 pattern), not a BranchName. Pass the resource-path leaf (e.g. 'production', 'staging', 'feature-add-orders') \u2013 the Lakebase API rejects uids in source_branch fields. If you have a uid and need to resolve it to its name, call resolveBranchId() from branch-utils first.`
      );
    }
    const validated = asBranchName(args.parentBranch);
    const parent = await getBranchByName(validated, lookup);
    if (parent) {
      sourceBranchPath = parent.name;
    } else if (args.strictParent === true) {
      throw new LakebaseBranchError(
        `parentBranch '${validated}' does not exist on project '${args.instance}', and strictParent: true was set. Either create '${validated}' first (e.g. cut it off the project default branch) or drop strictParent: true to fall back to the project default branch.`
      );
    } else {
      const def = await getDefaultBranch(lookup);
      if (!def) {
        throw new LakebaseBranchError(
          `parentBranch '${validated}' does not exist on project '${args.instance}' and the project has no default branch to fall back to.`
        );
      }
      const defaultLeaf = leafOf(def.name) ?? def.name;
      process.stderr.write(
        `[lakebase-branch-create] parentBranch '${validated}' not found on project '${args.instance}'; falling back to default branch '${defaultLeaf}'. Pass strictParent: true to throw instead.
`
      );
      sourceBranchPath = def.name;
    }
  } else if (args.currentBranch && args.currentBranch !== sanitized) {
    const current = await getBranchByName(args.currentBranch, lookup);
    if (current) sourceBranchPath = current.name;
  }
  if (!sourceBranchPath) {
    const def = await getDefaultBranch(lookup);
    if (!def) {
      throw new LakebaseBranchError(
        `Could not find a parent branch for "${sanitized}" \u2013 no parentBranch override, no currentBranch hint, and the project has no default branch.`
      );
    }
    sourceBranchPath = def.name;
  }
  const existing = await getBranchByName(sanitized, lookup);
  if (existing) {
    assertSourceMatches(existing, sourceBranchPath, sanitized);
    return existing;
  }
  if (args.ttl && args.noExpiry === true) {
    throw new LakebaseBranchError(
      `Cannot set both ttl ("${args.ttl}") and noExpiry: true on the same branch \u2013 they are mutually exclusive. Pass one or the other.`
    );
  }
  const specObj = {
    source_branch: sourceBranchPath
  };
  if (args.ttl) {
    specObj.ttl = args.ttl;
  } else if (args.noExpiry ?? true) {
    specObj.no_expiry = true;
  }
  try {
    await createWithTtlRecovery(args.instance, sanitized, specObj, args.host);
  } catch (err) {
    if (err instanceof LakebaseBranchTtlTooLongError) throw err;
    const landed = await getBranchByName(sanitized, lookup);
    if (!landed) throw err;
    assertSourceMatches(landed, sourceBranchPath, sanitized);
  }
  return waitForBranchReady({
    instance: args.instance,
    host: args.host,
    branch: sanitized,
    timeoutMs: args.readyTimeoutMs ?? KIT_TIMEOUTS.readyWait,
    pollIntervalMs: args.pollIntervalMs ?? KIT_TIMEOUTS.readyPoll
  });
}
async function waitForBranchReady(args) {
  const timeoutMs = args.timeoutMs ?? KIT_TIMEOUTS.readyWait;
  const interval = args.pollIntervalMs ?? KIT_TIMEOUTS.readyPoll;
  const result = await pollUntilDefined(
    async () => {
      const branch = await getBranchByName(args.branch, { instance: args.instance, host: args.host });
      return branch && branch.state === "READY" ? branch : void 0;
    },
    { timeoutMs, intervalMs: interval }
  );
  if (result.outcome === "timeout") {
    throw new LakebaseBranchError(
      `Branch "${args.branch}" did not reach READY within ${timeoutMs}ms`
    );
  }
  return result.value;
}
function leafOf(pathOrName) {
  if (!pathOrName) return void 0;
  const segments = pathOrName.split("/");
  return segments[segments.length - 1] || void 0;
}
function assertSourceMatches(existing, sourceBranchPath, sanitized) {
  const existingLeaf = leafOf(existing.sourceBranchName);
  const requestedLeaf = leafOf(sourceBranchPath);
  if (existingLeaf && requestedLeaf && existingLeaf !== requestedLeaf) {
    throw new LakebaseBranchError(
      `Branch "${sanitized}" already exists, but was forked from "${existingLeaf}", not the requested "${requestedLeaf}". Delete the existing branch first, or pick a different target name.`
    );
  }
}
async function createWithTtlRecovery(instance, sanitized, specObj, host) {
  const originalTtl = specObj.ttl;
  try {
    await dbcli4(
      ["postgres", "create-branch", projectPath(instance), sanitized, "--json", JSON.stringify({ spec: specObj })],
      host
    );
    return;
  } catch (err) {
    if (!(err instanceof DatabricksCliError) || !originalTtl || !isTtlTooLongError(err.message)) {
      throw err;
    }
    let retention = getCachedProjectRetention(instance);
    if (retention === void 0) {
      retention = await getProjectRetentionDuration({ projectId: instance, host });
      cacheProjectRetention(instance, retention);
    }
    const FALLBACK_TTL = "604800s";
    const effectiveRetention = retention ?? FALLBACK_TTL;
    const clamped = minLakebaseTtl(originalTtl, effectiveRetention) ?? effectiveRetention;
    if (clamped === originalTtl) {
      throw new LakebaseBranchTtlTooLongError(originalTtl, err.message);
    }
    process.stderr.write(
      `[lakebase-branch-create] workspace TTL cap rejected '${originalTtl}' for project '${instance}'; retrying with ` + (retention ? `retention-clamped '${clamped}'.
` : `hardcoded fallback '${clamped}' (history_retention_duration not discoverable).
`)
    );
    const retrySpec = { ...specObj, ttl: clamped };
    try {
      await dbcli4(
        ["postgres", "create-branch", projectPath(instance), sanitized, "--json", JSON.stringify({ spec: retrySpec })],
        host
      );
    } catch (retryErr) {
      if (retryErr instanceof DatabricksCliError && isTtlTooLongError(retryErr.message)) {
        throw new LakebaseBranchTtlTooLongError(
          clamped,
          `Workspace rejected retention-clamped TTL '${clamped}' (original '${originalTtl}'): ${retryErr.message}`
        );
      }
      throw retryErr;
    }
  }
}
function dbcli4(args, host) {
  return runDatabricks(args, { host, timeout: KIT_TIMEOUTS.cliCreateBranch });
}

// scripts/lakebase/convention-branches.ts
init_esm_shims();

// scripts/lakebase/paired-branch.ts
init_esm_shims();
import * as fs4 from "fs";
import * as path4 from "path";
import { execFileSync as execFileSync4 } from "child_process";

// scripts/lakebase/branch-endpoint.ts
init_esm_shims();

// scripts/lakebase/get-connection.ts
init_esm_shims();
import { createLakebasePool } from "@databricks/lakebase";
import { Client } from "pg";

// scripts/lakebase/constants.ts
init_esm_shims();
var POSTGRES_PORT = 5432;
var DEFAULT_DATABASE = "databricks_postgres";
var RUNTIME_ARTIFACT_IGNORE = [
  ".consort/",
  ".sftdd/",
  ".tdd/",
  ".lakebase/",
  ".claude/agent-memory/"
];
var DEFAULT_ENDPOINT = "primary";
var CONSORT_APPLICATION_NAME = "consort";
var SCM_UTILS_APPLICATION_NAME = "scm-utils";
var CONSORT_VERSION_ENV = "CONSORT_VERSION";

// scripts/lakebase/self-version.ts
init_esm_shims();
import * as fs3 from "fs";
import * as path3 from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
var PKG_NAME = "@databricks-solutions/lakebase-scm-utils";
var cached;
function substrateSelfVersion() {
  if (cached !== void 0) return cached;
  cached = "unknown";
  try {
    let dir = path3.dirname(fileURLToPath2(import.meta.url));
    for (let i = 0; i < 8; i++) {
      const pkgPath = path3.join(dir, "package.json");
      if (fs3.existsSync(pkgPath)) {
        try {
          const pkg = JSON.parse(fs3.readFileSync(pkgPath, "utf8"));
          if (pkg.name === PKG_NAME && typeof pkg.version === "string" && pkg.version.length > 0) {
            cached = pkg.version;
            return cached;
          }
        } catch {
        }
      }
      const parent = path3.dirname(dir);
      if (parent === dir) break;
      dir = parent;
    }
  } catch {
  }
  return cached;
}

// scripts/lakebase/get-connection.ts
function connectionApplicationName() {
  const consortVersion = process.env[CONSORT_VERSION_ENV]?.trim();
  return consortVersion ? `${CONSORT_APPLICATION_NAME}/${consortVersion}` : `${SCM_UTILS_APPLICATION_NAME}/${substrateSelfVersion()}`;
}
async function getConnection(args) {
  const endpointName = args.endpointName ?? DEFAULT_ENDPOINT;
  const database = args.database ?? process.env.PGDATABASE ?? DEFAULT_DATABASE;
  const branchId = await resolveBranchId({ instance: args.instance, branch: args.branch });
  const endpointPath2 = `projects/${args.instance}/branches/${branchId}/endpoints/${endpointName}`;
  if (args.output === "dsn") {
    const host2 = await resolveEndpointHost(args.instance, branchId);
    const { token, email: email2 } = await mintCredential(endpointPath2);
    const url = buildPostgresUrl({ host: host2, port: POSTGRES_PORT, database, user: email2, password: token });
    return { url, host: host2, port: POSTGRES_PORT, database, user: email2, endpointPath: endpointPath2 };
  }
  const host = await resolveEndpointHost(args.instance, branchId);
  const email = await resolveCurrentUser();
  return createLakebasePool({
    endpoint: endpointPath2,
    host,
    database,
    user: email,
    // workspaceClient is passed through verbatim. createLakebasePool falls
    // back to environment / ServiceContext when omitted.
    ...args.workspaceClient !== void 0 ? { workspaceClient: args.workspaceClient } : {}
  });
}
async function resolveEndpointHost(instance, branch) {
  const branchId = await resolveBranchId({ instance, branch });
  const branchPath = `projects/${instance}/branches/${branchId}`;
  const raw = dbcli5(["postgres", "list-endpoints", branchPath, "-o", "json"]);
  const endpoints = JSON.parse(raw);
  if (!Array.isArray(endpoints) || endpoints.length === 0) {
    throw new Error(`No endpoints found for branch ${branchPath}`);
  }
  const host = endpoints[0]?.status?.hosts?.host;
  if (!host) {
    throw new Error(`Endpoint exists for ${branchPath} but has no host yet \u2013 wait for it to become ACTIVE`);
  }
  return host;
}
async function mintCredential(endpointPath2) {
  const raw = dbcli5(["postgres", "generate-database-credential", endpointPath2, "-o", "json"]);
  const token = JSON.parse(raw)?.token ?? "";
  if (!token) {
    throw new Error(`generate-database-credential returned no token for ${endpointPath2}`);
  }
  const email = await resolveCurrentUser();
  return { token, email };
}
async function resolveCurrentUser() {
  const raw = dbcli5(["current-user", "me", "-o", "json"]);
  const parsed = JSON.parse(raw);
  const email = parsed.userName ?? parsed.emails?.[0]?.value;
  if (!email) {
    throw new Error("Could not resolve current user from `databricks current-user me`");
  }
  return email;
}
function buildPostgresUrl(parts) {
  const u = new URL(`postgresql://${parts.host}:${parts.port}/${encodeURIComponent(parts.database)}`);
  u.username = encodeURIComponent(parts.user);
  u.password = encodeURIComponent(parts.password);
  u.searchParams.set("sslmode", "require");
  return u.toString();
}
function dbcli5(args) {
  return runDatabricksSync(args, { timeout: KIT_TIMEOUTS.cliDefault });
}
async function waitForBranchAuthReady(args) {
  const timeoutMs = args.timeoutMs ?? 6e4;
  const initialBackoffMs = args.initialBackoffMs ?? 2e3;
  const deadline = Date.now() + timeoutMs;
  let backoffMs = initialBackoffMs;
  let lastErr;
  let attempt = 0;
  while (Date.now() < deadline) {
    attempt++;
    let client;
    try {
      const dsn = await getConnection({
        instance: args.instance,
        branch: args.branch,
        endpointName: args.endpointName,
        database: args.database,
        output: "dsn"
      });
      client = new Client({ connectionString: dsn.url, application_name: connectionApplicationName() });
      await client.connect();
      await client.query("SELECT 1");
      await client.end();
      return;
    } catch (err) {
      lastErr = err;
      if (client) {
        try {
          await client.end();
        } catch {
        }
      }
      if (!isTransientAuthFailure(err)) {
        throw err;
      }
      const remaining = deadline - Date.now();
      if (remaining <= 0) break;
      const wait2 = Math.min(backoffMs, remaining);
      await new Promise((r) => setTimeout(r, wait2));
      backoffMs = Math.min(backoffMs * 2, 8e3);
    }
  }
  throw new Error(
    `waitForBranchAuthReady: timed out after ${timeoutMs}ms (${attempt} attempts) against projects/${args.instance}/branches/${args.branch}. Last error: ${lastErr instanceof Error ? lastErr.message : String(lastErr)}`
  );
}
function isTransientAuthFailure(err) {
  const msg = err instanceof Error ? err.message : String(err);
  return /external authorization failed/i.test(msg) || /password authentication failed/i.test(msg) || /authentication failed/i.test(msg);
}

// scripts/lakebase/branch-endpoint.ts
async function getEndpoint(args) {
  const branchPath = await resolveBranchPath(args.branch, { instance: args.instance });
  if (!branchPath) {
    return void 0;
  }
  let raw;
  try {
    raw = runDatabricksSync(["postgres", "list-endpoints", branchPath, "-o", "json"], {
      timeout: KIT_TIMEOUTS.cliDefault
    });
  } catch {
    return void 0;
  }
  let endpoints;
  try {
    endpoints = JSON.parse(raw);
  } catch {
    return void 0;
  }
  if (!Array.isArray(endpoints) || endpoints.length === 0) {
    return void 0;
  }
  const ep = endpoints[0];
  return {
    host: ep?.status?.hosts?.host ?? "",
    state: ep?.status?.current_state ?? "UNKNOWN"
  };
}
function endpointPath(instance, branch, endpointName = DEFAULT_ENDPOINT) {
  return `projects/${instance}/branches/${branch}/endpoints/${endpointName}`;
}
async function ensureEndpoint(args) {
  const endpointName = args.endpointName ?? DEFAULT_ENDPOINT;
  const branchId = await resolveBranchId({ instance: args.instance, branch: args.branch });
  const existing = await getEndpoint({ instance: args.instance, branch: branchId, endpointName });
  if (existing?.host) {
    return existing;
  }
  const branchPath = `projects/${args.instance}/branches/${branchId}`;
  const spec = {
    spec: {
      endpoint_type: args.endpointType ?? "ENDPOINT_TYPE_READ_WRITE",
      autoscaling_limit_min_cu: args.autoscalingMinCu ?? 2,
      autoscaling_limit_max_cu: args.autoscalingMaxCu ?? 4
    }
  };
  try {
    runDatabricksSync(
      ["postgres", "create-endpoint", branchPath, endpointName, "--json", JSON.stringify(spec)],
      { timeout: KIT_TIMEOUTS.cliCreateEndpoint }
    );
  } catch (err) {
    const racy = await getEndpoint({ instance: args.instance, branch: branchId, endpointName });
    if (racy?.host) return racy;
    throw err;
  }
  const timeoutMs = args.timeoutMs ?? KIT_TIMEOUTS.readyWait;
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const ep = await getEndpoint({ instance: args.instance, branch: branchId, endpointName });
    if (ep?.host) return ep;
    await new Promise((r) => setTimeout(r, KIT_TIMEOUTS.readyPoll));
  }
  throw new Error(
    `Endpoint for ${branchPath} did not reach ACTIVE within ${timeoutMs}ms (create succeeded but no host yet)`
  );
}
async function getCredential(args) {
  const branchPath = await resolveBranchPath(args.branch, { instance: args.instance });
  if (!branchPath) {
    throw new Error(`Branch "${args.branch}" not found in instance "${args.instance}"`);
  }
  const endpointName = args.endpointName ?? DEFAULT_ENDPOINT;
  return mintCredential(`${branchPath}/endpoints/${endpointName}`);
}

// scripts/git/status.ts
init_esm_shims();
async function hasUpstream(args) {
  try {
    await exec2("git rev-parse --abbrev-ref @{u}", { cwd: args.cwd });
    return true;
  } catch {
    return false;
  }
}
async function getAheadBehind(args) {
  const { cwd } = args;
  try {
    const upstream = await exec2("git rev-parse --abbrev-ref @{u}", { cwd });
    const raw = await exec2("git rev-list --left-right --count HEAD...@{u}", {
      cwd
    });
    const parts = raw.trim().split(/\s+/);
    return {
      ahead: parseInt(parts[0], 10) || 0,
      behind: parseInt(parts[1], 10) || 0,
      upstream
    };
  } catch {
    return { ahead: 0, behind: 0, upstream: "" };
  }
}
async function isDirty(args) {
  try {
    const ignore = args.ignore ?? [];
    const untrackedFlag = args.untracked === false ? " --untracked-files=no" : "";
    let command = `git status --porcelain${untrackedFlag}`;
    if (ignore.length > 0) {
      const excludes = ignore.map((p) => shq(`:(exclude)${p.replace(/\/+$/, "")}`)).join(" ");
      command = `git status --porcelain${untrackedFlag} -- . ${excludes}`;
    }
    const out = await exec2(command, { cwd: args.cwd });
    return out.trim().length > 0;
  } catch {
    return false;
  }
}

// scripts/lakebase/paired-branch.ts
function gitCurrentBranch(cwd) {
  return execFileSync4("git", ["rev-parse", "--abbrev-ref", "HEAD"], {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    timeout: KIT_TIMEOUTS.gitDefault
  }).trim();
}
function gitHasLocalBranch(cwd, branch) {
  try {
    execFileSync4("git", ["rev-parse", "--verify", "--quiet", `refs/heads/${branch}`], {
      cwd,
      stdio: "ignore",
      timeout: KIT_TIMEOUTS.gitDefault
    });
    return true;
  } catch {
    return false;
  }
}
function gitCheckoutNewBranch(cwd, branch, startPoint) {
  const argv = startPoint ? ["checkout", "-b", branch, startPoint] : ["checkout", "-b", branch];
  execFileSync4("git", argv, {
    cwd,
    stdio: ["ignore", "pipe", "pipe"],
    timeout: KIT_TIMEOUTS.gitCheckout
  });
}
function gitFetchBranch(cwd, remote, branch) {
  try {
    execFileSync4("git", ["fetch", remote, branch], {
      cwd,
      stdio: ["ignore", "pipe", "pipe"],
      timeout: KIT_TIMEOUTS.gitNetwork
    });
  } catch {
  }
}
function gitRefExists(cwd, ref) {
  try {
    execFileSync4("git", ["rev-parse", "--verify", "--quiet", ref], {
      cwd,
      stdio: ["ignore", "pipe", "pipe"],
      timeout: KIT_TIMEOUTS.gitDefault
    });
    return true;
  } catch {
    return false;
  }
}
function resolveFeatureStartPoint(cwd, parentBranch) {
  if (!parentBranch) return void 0;
  gitFetchBranch(cwd, "origin", parentBranch);
  if (gitRefExists(cwd, `origin/${parentBranch}`)) return `origin/${parentBranch}`;
  if (gitRefExists(cwd, parentBranch)) return parentBranch;
  return void 0;
}
async function assertCleanForFork(cwd, startPoint) {
  if (!startPoint) return;
  if (await isDirty({ cwd, ignore: [...RUNTIME_ARTIFACT_IGNORE], untracked: false })) {
    throw new Error(
      `Working tree has uncommitted changes; refusing to fork from ${startPoint} (they would be carried onto the new branch). Commit or stash first.`
    );
  }
}
function gitCheckoutExistingBranch(cwd, branch) {
  execFileSync4("git", ["checkout", branch], {
    cwd,
    stdio: ["ignore", "pipe", "pipe"],
    timeout: KIT_TIMEOUTS.gitCheckout
  });
}
function gitMergeBranch(cwd, branch) {
  execFileSync4("git", ["merge", "--no-edit", branch], {
    cwd,
    stdio: ["ignore", "pipe", "pipe"],
    timeout: KIT_TIMEOUTS.gitDefault
  });
}
function gitDeleteLocalBranch(cwd, branch, force = true) {
  execFileSync4("git", ["branch", force ? "-D" : "-d", branch], {
    cwd,
    stdio: ["ignore", "pipe", "pipe"],
    timeout: KIT_TIMEOUTS.gitDefault
  });
}
function gitHasRemoteBranch(cwd, remote, branch) {
  try {
    const out = execFileSync4(
      "git",
      ["ls-remote", "--exit-code", "--heads", remote, branch],
      { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], timeout: KIT_TIMEOUTS.gitNetwork }
    );
    return out.trim().length > 0;
  } catch {
    return false;
  }
}
function gitDeleteRemoteBranch(cwd, remote, branch) {
  execFileSync4("git", ["push", remote, "--delete", branch], {
    cwd,
    stdio: ["ignore", "pipe", "pipe"],
    timeout: KIT_TIMEOUTS.gitPush
  });
}
function readEnvVar2(envPath, key) {
  if (!fs4.existsSync(envPath)) return void 0;
  const content = fs4.readFileSync(envPath, "utf-8");
  const match = content.match(new RegExp(`^${key}=(.*)$`, "m"));
  if (!match) return void 0;
  return match[1].trim().replace(/^["']|["']$/g, "");
}
function buildDsn(host, database, user, password) {
  const u = new URL(`postgresql://${host}:${POSTGRES_PORT}/${encodeURIComponent(database)}`);
  u.username = encodeURIComponent(user);
  u.password = encodeURIComponent(password);
  u.searchParams.set("sslmode", "require");
  return u.toString();
}
async function createPairedBranch(args) {
  const warnings = [];
  const sanitized = sanitizeBranchName(args.branch);
  const createGitBranch = args.createGitBranch !== false;
  const syncEnv = args.syncEnv !== false;
  const database = args.database ?? process.env.PGDATABASE ?? DEFAULT_DATABASE;
  let gitStartPoint;
  if (createGitBranch && !gitHasLocalBranch(args.cwd, sanitized)) {
    gitStartPoint = resolveFeatureStartPoint(args.cwd, args.parentBranch);
    await assertCleanForFork(args.cwd, gitStartPoint);
  }
  const branch = await createBranch({
    instance: args.instance,
    branch: args.branch,
    parentBranch: args.parentBranch,
    ttl: args.ttl,
    noExpiry: args.noExpiry
  });
  let ready = branch;
  if (branch.state !== "READY") {
    try {
      ready = await waitForBranchReady({
        instance: args.instance,
        branch: sanitized,
        timeoutMs: args.readyTimeoutMs ?? KIT_TIMEOUTS.readyWait
      });
    } catch (err) {
      warnings.push(
        `Lakebase branch created but did not reach READY: ${err instanceof Error ? err.message : String(err)}`
      );
    }
  }
  let gitBranchCreated = false;
  if (createGitBranch) {
    try {
      if (gitHasLocalBranch(args.cwd, sanitized)) {
        gitCheckoutExistingBranch(args.cwd, sanitized);
      } else {
        gitCheckoutNewBranch(args.cwd, sanitized, gitStartPoint);
        gitBranchCreated = true;
      }
    } catch (err) {
      warnings.push(
        `Failed to create/switch git branch "${sanitized}": ${err instanceof Error ? err.message : String(err)}`
      );
    }
  }
  let envSynced = false;
  if (syncEnv && ready.state === "READY") {
    try {
      const ep = await ensureEndpoint({
        instance: args.instance,
        branch: sanitized,
        timeoutMs: args.readyTimeoutMs ?? KIT_TIMEOUTS.readyWait
      });
      const { email } = await mintCredential(endpointPath(args.instance, sanitized));
      const envPath = path4.join(args.cwd, ".env");
      updateEnvConnection({
        envPath,
        projectId: args.instance,
        branchId: sanitized,
        username: email,
        endpointHost: ep.host
      });
      await ensureProfilePinned({ envPath }).catch(() => void 0);
      envSynced = true;
    } catch (err) {
      warnings.push(
        `.env sync failed: ${err instanceof Error ? err.message : String(err)}`
      );
    }
  }
  return {
    branch: ready,
    gitBranch: sanitized,
    gitBranchCreated,
    envSynced,
    warnings
  };
}
async function deletePairedBranch(args) {
  const warnings = [];
  const sanitized = sanitizeBranchName(args.branch);
  const deleteGitLocal = args.deleteGitLocal !== false;
  const deleteGitRemote = args.deleteGitRemote !== false;
  const gitRemote = args.gitRemote ?? "origin";
  let lakebaseDeleted = false;
  try {
    await deleteBranch({ instance: args.instance, branch: sanitized });
    lakebaseDeleted = true;
  } catch (err) {
    warnings.push(
      `Lakebase delete failed: ${err instanceof Error ? err.message : String(err)}`
    );
  }
  let gitLocalDeleted = false;
  if (deleteGitLocal) {
    try {
      const current = gitCurrentBranch(args.cwd);
      if (current === sanitized) {
        warnings.push(`Skipped local git delete: branch "${sanitized}" is currently checked out`);
      } else if (!gitHasLocalBranch(args.cwd, sanitized)) {
        gitLocalDeleted = true;
      } else {
        gitDeleteLocalBranch(args.cwd, sanitized, true);
        gitLocalDeleted = true;
      }
    } catch (err) {
      warnings.push(
        `Local git delete failed: ${err instanceof Error ? err.message : String(err)}`
      );
    }
  }
  let gitRemoteDeleted = false;
  if (deleteGitRemote) {
    try {
      if (gitHasRemoteBranch(args.cwd, gitRemote, sanitized)) {
        gitDeleteRemoteBranch(args.cwd, gitRemote, sanitized);
        gitRemoteDeleted = true;
      } else {
        gitRemoteDeleted = true;
      }
    } catch (err) {
      warnings.push(
        `Remote git delete failed: ${err instanceof Error ? err.message : String(err)}`
      );
    }
  }
  return { lakebaseDeleted, gitLocalDeleted, gitRemoteDeleted, warnings };
}
async function syncEnvToCurrentBranch(args) {
  const envPath = path4.join(args.cwd, ".env");
  const instance = args.instance ?? readEnvVar2(envPath, "LAKEBASE_PROJECT_ID");
  if (!instance) {
    throw new Error(
      `Could not resolve Lakebase instance id (set LAKEBASE_PROJECT_ID in .env or pass --instance)`
    );
  }
  const rawBranch = args.branch ?? gitCurrentBranch(args.cwd);
  const trunkAlias = args.trunkAlias?.trim();
  const isTrunk = trunkAlias && rawBranch === trunkAlias || !trunkAlias && (rawBranch === "main" || rawBranch === "master");
  let sanitized;
  if (isTrunk) {
    const lakebaseBranches = await listBranches({ instance });
    const def = lakebaseBranches.find((b) => b.isDefault);
    if (!def) {
      throw new Error(
        `Could not resolve default Lakebase branch for instance "${instance}"`
      );
    }
    sanitized = def.name.split("/branches/").pop() ?? def.uid;
  } else {
    sanitized = sanitizeBranchName(rawBranch);
  }
  const database = args.database ?? process.env.PGDATABASE ?? DEFAULT_DATABASE;
  const ep = await getEndpoint({ instance, branch: sanitized });
  if (!ep?.host) {
    throw new Error(
      `No endpoint host yet for branch "${sanitized}" in instance "${instance}" \u2013 branch may still be provisioning`
    );
  }
  const { token, email } = await getCredential({ instance, branch: sanitized });
  const dsn = buildDsn(ep.host, database, email, token);
  updateEnvConnection({
    envPath,
    projectId: instance,
    branchId: sanitized,
    username: email,
    endpointHost: ep.host
  });
  await ensureProfilePinned({ envPath }).catch(() => void 0);
  return { branchId: sanitized, endpointHost: ep.host, databaseUrl: dsn };
}
async function checkoutPaired(args) {
  const warnings = [];
  const envPath = path4.join(args.cwd, ".env");
  const instance = args.instance ?? readEnvVar2(envPath, "LAKEBASE_PROJECT_ID");
  if (!instance) {
    throw new Error(
      `Could not resolve Lakebase instance (set LAKEBASE_PROJECT_ID in .env or pass --instance)`
    );
  }
  const rawBranch = args.branch ?? gitCurrentBranch(args.cwd);
  if (!rawBranch || rawBranch === "HEAD") {
    throw new Error(
      `Cannot resolve current git branch (detached HEAD or not a git repo at ${args.cwd})`
    );
  }
  const branchId = sanitizeBranchName(rawBranch);
  const database = args.database ?? process.env.PGDATABASE ?? DEFAULT_DATABASE;
  const previousBranch = args.previousBranch ?? readEnvVar2(envPath, "LAKEBASE_BRANCH_ID") ?? "";
  const trunkAlias = args.trunkAlias?.trim();
  let mode = "feature";
  let lakebaseBranch = branchId;
  const isTrunkAlias = trunkAlias && rawBranch === trunkAlias;
  const isMainOrMaster = !trunkAlias && (rawBranch === "main" || rawBranch === "master");
  const lakebaseBranches = await listBranches({ instance });
  const tierMatch = isTier(rawBranch, lakebaseBranches, protectedTierNamesFromEnv());
  if (isTrunkAlias || isMainOrMaster) {
    mode = "trunk";
    const def = lakebaseBranches.find((b) => b.isDefault);
    if (!def) {
      throw new Error(
        `Could not resolve default Lakebase branch for instance "${instance}"`
      );
    }
    lakebaseBranch = def.name.split("/branches/").pop() ?? def.uid;
  } else if (tierMatch) {
    mode = "tier";
    lakebaseBranch = rawBranch;
  } else {
    let existing = await getBranchByName(branchId, { instance });
    if (!existing) {
      if (args.autoCreate !== false) {
        const parentBranch = await resolveFeatureParent({
          instance,
          target: branchId,
          baseBranch: args.baseBranch,
          previousBranch
        });
        const created = await createBranch({
          instance,
          branch: rawBranch,
          parentBranch
        });
        if (created.state !== "READY") {
          try {
            await waitForBranchReady({
              instance,
              branch: branchId,
              timeoutMs: args.readyTimeoutMs ?? KIT_TIMEOUTS.readyWait
            });
          } catch (err) {
            warnings.push(
              `Lakebase branch created but did not reach READY: ${err instanceof Error ? err.message : String(err)}`
            );
          }
        }
        existing = await getBranchByName(branchId, { instance });
        mode = "feature-created";
      } else {
        throw new Error(
          `Lakebase branch "${branchId}" does not exist and autoCreate=false`
        );
      }
    }
    lakebaseBranch = branchId;
  }
  const ep = await ensureEndpoint({
    instance,
    branch: lakebaseBranch,
    timeoutMs: args.readyTimeoutMs ?? KIT_TIMEOUTS.readyWait
  });
  const { token, email } = await mintCredential(endpointPath(instance, lakebaseBranch));
  const dsn = buildDsn(ep.host, database, email, token);
  updateEnvConnection({
    envPath,
    projectId: instance,
    branchId: lakebaseBranch,
    username: email,
    endpointHost: ep.host
  });
  await ensureProfilePinned({ envPath }).catch(() => void 0);
  return {
    branchId,
    mode,
    matchedLakebaseBranch: lakebaseBranch,
    endpointHost: ep.host,
    databaseUrl: dsn,
    envUpdated: true,
    warnings
  };
}
async function resolveFeatureParent(args) {
  if (args.baseBranch) {
    return args.baseBranch;
  }
  if (args.previousBranch && args.previousBranch !== args.target) {
    const prev = await getBranchByName(args.previousBranch, { instance: args.instance });
    if (prev) {
      return args.previousBranch;
    }
  }
  return void 0;
}
async function mergePaired(args) {
  const warnings = [];
  const syncEnv = args.syncEnv !== false;
  gitCheckoutExistingBranch(args.cwd, args.into);
  let checkout;
  if (syncEnv) {
    checkout = await checkoutPaired({ cwd: args.cwd, branch: args.into, instance: args.instance });
    warnings.push(...checkout.warnings);
  }
  gitMergeBranch(args.cwd, args.from);
  return { merged: true, into: args.into, from: args.from, checkout, warnings };
}

// scripts/lakebase/convention-branches.ts
var CONVENTION_TIER_DEFAULTS = {
  feature: { ttl: formatLakebaseTtl(KIT_TIMEOUTS.featureBranchTtlMs), parentBranch: "staging" },
  test: { ttl: formatLakebaseTtl(KIT_TIMEOUTS.testBranchTtlMs), parentBranch: "staging" },
  uat: { ttl: formatLakebaseTtl(KIT_TIMEOUTS.uatBranchTtlMs), parentBranch: "staging" },
  perf: { ttl: formatLakebaseTtl(KIT_TIMEOUTS.perfBranchTtlMs), parentBranch: "staging" }
};
async function createFeaturePairedBranch(args) {
  return createPairedBranch({
    instance: args.instance,
    branch: args.branch,
    parentBranch: args.parentBranch ?? CONVENTION_TIER_DEFAULTS.feature.parentBranch,
    ...args.ttl ? { ttl: args.ttl } : { noExpiry: true },
    cwd: args.cwd,
    createGitBranch: args.createGitBranch,
    syncEnv: args.syncEnv,
    readyTimeoutMs: args.readyTimeoutMs,
    database: args.database
  });
}
async function createTestPairedBranch(args) {
  return createPairedBranch({
    instance: args.instance,
    branch: args.branch,
    parentBranch: args.parentBranch ?? CONVENTION_TIER_DEFAULTS.test.parentBranch,
    ttl: args.ttl ?? CONVENTION_TIER_DEFAULTS.test.ttl,
    cwd: args.cwd,
    createGitBranch: args.createGitBranch,
    syncEnv: args.syncEnv,
    readyTimeoutMs: args.readyTimeoutMs,
    database: args.database
  });
}
async function createUatPairedBranch(args) {
  return createPairedBranch({
    instance: args.instance,
    branch: args.branch,
    parentBranch: args.parentBranch ?? CONVENTION_TIER_DEFAULTS.uat.parentBranch,
    ttl: args.ttl ?? CONVENTION_TIER_DEFAULTS.uat.ttl,
    cwd: args.cwd,
    createGitBranch: args.createGitBranch,
    syncEnv: args.syncEnv,
    readyTimeoutMs: args.readyTimeoutMs,
    database: args.database
  });
}
async function createPerfPairedBranch(args) {
  return createPairedBranch({
    instance: args.instance,
    branch: args.branch,
    parentBranch: args.parentBranch ?? CONVENTION_TIER_DEFAULTS.perf.parentBranch,
    ttl: args.ttl ?? CONVENTION_TIER_DEFAULTS.perf.ttl,
    cwd: args.cwd,
    createGitBranch: args.createGitBranch,
    syncEnv: args.syncEnv,
    readyTimeoutMs: args.readyTimeoutMs,
    database: args.database
  });
}

// scripts/lakebase/cut-backup.ts
init_esm_shims();
async function cutBackup(args) {
  const backup = await createBranch({
    instance: args.instance,
    host: args.host,
    branch: args.backupName,
    parentBranch: args.sourceBranch,
    readyTimeoutMs: args.readyTimeoutMs,
    pollIntervalMs: args.pollIntervalMs,
    // Backups must outlive any ephemeral-branch expiration so the
    // rollback contract holds: if Lakebase auto-expired a backup
    // before the operator decided to roll back, the release flow
    // would have nothing to restore to.
    noExpiry: true
  });
  return {
    backup,
    sourceBranchName: backup.sourceBranchName ?? ""
  };
}

// scripts/lakebase/databricks-host.ts
init_esm_shims();
async function resolveDatabricksHost(args) {
  const timeoutMs = args.timeoutMs ?? KIT_TIMEOUTS.cliDefault;
  const out = await runDatabricks(["auth", "describe", "-o", "json"], {
    profile: args.profile,
    timeout: timeoutMs
  });
  return parseHostFromAuthDescribe(out);
}
function parseHostFromAuthDescribe(out) {
  const start = out.indexOf("{");
  if (start < 0) return void 0;
  try {
    const parsed = JSON.parse(out.slice(start));
    const details = parsed.details;
    if (!details || typeof details !== "object") return void 0;
    const host = details.host;
    if (typeof host !== "string") return void 0;
    return host.replace(/\/+$/, "");
  } catch {
    return void 0;
  }
}

// scripts/lakebase/deploy-app-endpoint.ts
init_esm_shims();
import { spawn } from "child_process";

// scripts/lakebase/deploy-workspace-upload.ts
init_esm_shims();
import { readdirSync, statSync } from "fs";
import { join as join5, sep as sep2 } from "path";
var DEFAULT_SKIP_DIRS = [
  "node_modules",
  ".git",
  "dist",
  ".tmp",
  ".vitest",
  ".venv-live-tests",
  ".tools-live-tests",
  ".venv",
  "coverage"
];
async function uploadDirectory(args) {
  const skipSet = new Set(args.skipDirs ?? DEFAULT_SKIP_DIRS);
  const timeoutMs = args.timeoutMs ?? KIT_TIMEOUTS.cliDefault;
  const createdDirs = /* @__PURE__ */ new Set();
  const errors = [];
  let filesUploaded = 0;
  const ensureRemoteDir = async (remoteDir) => {
    if (createdDirs.has(remoteDir)) return;
    await runDatabricks(["workspace", "mkdirs", remoteDir], { profile: args.profile, timeout: timeoutMs });
    createdDirs.add(remoteDir);
  };
  await ensureRemoteDir(args.workspacePath);
  const uploadFile = async (localFile, relPath) => {
    const remotePath = `${args.workspacePath}/${relPath.split(sep2).join("/")}`;
    const remoteDir = remotePath.substring(0, remotePath.lastIndexOf("/"));
    if (remoteDir !== args.workspacePath) {
      await ensureRemoteDir(remoteDir);
    }
    try {
      await runDatabricks(
        ["workspace", "import", remotePath, "--file", localFile, "--format", "AUTO", "--overwrite"],
        { profile: args.profile, timeout: timeoutMs }
      );
      filesUploaded++;
    } catch (err) {
      errors.push({ relPath, error: err.message });
    }
  };
  const walk = async (dirAbs, dirRel) => {
    for (const entry of readdirSync(dirAbs)) {
      const childAbs = join5(dirAbs, entry);
      const childRel = dirRel ? `${dirRel}${sep2}${entry}` : entry;
      const stat = statSync(childAbs);
      if (stat.isDirectory()) {
        if (skipSet.has(entry)) continue;
        await walk(childAbs, childRel);
      } else if (stat.isFile()) {
        await uploadFile(childAbs, childRel);
      }
    }
  };
  await walk(args.localRoot, "");
  return {
    filesUploaded,
    dirsCreated: createdDirs.size - 1,
    // subtract the root we always create
    errors
  };
}

// scripts/lakebase/deploy-app-endpoint.ts
async function getAppEndpoint(args) {
  const timeoutMs = args.timeoutMs ?? KIT_TIMEOUTS.cliDefault;
  try {
    const stdout = await runDatabricks(["apps", "get", args.appName, "-o", "json"], {
      profile: args.profile,
      timeout: timeoutMs
    });
    const info = JSON.parse(stdout);
    return {
      exists: true,
      url: typeof info.url === "string" ? info.url : void 0,
      info
    };
  } catch (err) {
    const msg = err.message;
    if (/RESOURCE_DOES_NOT_EXIST|does not exist or is deleted|App .* does not exist|status:? 404\b/i.test(msg)) {
      return { exists: false, url: void 0, info: void 0 };
    }
    throw err;
  }
}
async function deleteAppEndpoint(args) {
  const ignoreMissing = args.ignoreMissing !== false;
  const timeoutMs = args.timeoutMs ?? KIT_TIMEOUTS.cliDefault;
  let appDeleted = false;
  let workspaceDeleted = false;
  let found = false;
  try {
    await runDatabricks(
      ["apps", "delete", args.appName],
      { profile: args.profile, timeout: timeoutMs }
    );
    appDeleted = true;
    found = true;
  } catch (err) {
    const msg = err.message;
    if (ignoreMissing && /RESOURCE_DOES_NOT_EXIST|does not exist or is deleted|App .* does not exist|status:? 404\b/i.test(msg)) {
      found = false;
    } else {
      throw err;
    }
  }
  if (args.workspacePath) {
    try {
      await runDatabricks(
        ["workspace", "delete", args.workspacePath, "--recursive"],
        {
          profile: args.profile,
          timeout: timeoutMs
        }
      );
      workspaceDeleted = true;
    } catch (err) {
      const msg = err.message;
      if (!/RESOURCE_DOES_NOT_EXIST|does not exist or is deleted|App .* does not exist|status:? 404\b/i.test(msg)) {
        throw err;
      }
    }
  }
  return { appDeleted, workspaceDeleted, found };
}
async function ensureAppEndpoint(args) {
  const description = args.description ?? "Deployed by lakebase-scm-utils";
  const createTimeoutMs = args.createTimeoutMs ?? 12e5;
  const deployTimeoutMs = args.deployTimeoutMs ?? 6e5;
  const lookup = await getAppEndpoint({ appName: args.appName, profile: args.profile });
  let created = false;
  if (!lookup.exists) {
    await runDatabricks(["apps", "create", args.appName, "--description", description], {
      profile: args.profile,
      timeout: createTimeoutMs
    });
    created = true;
  }
  const upload = await uploadDirectory({
    localRoot: args.workspaceRoot,
    workspacePath: args.workspacePath,
    profile: args.profile
  });
  const { ok, exitCode, stdout, stderr } = await runDeploy({
    appName: args.appName,
    workspacePath: args.workspacePath,
    profile: args.profile,
    timeoutMs: deployTimeoutMs
  });
  let url;
  try {
    const post = await getAppEndpoint({ appName: args.appName, profile: args.profile });
    url = post.url;
  } catch {
  }
  return {
    ok,
    url,
    created,
    upload,
    exitCode,
    deployStdout: stdout,
    deployStderr: stderr
  };
}
async function getCiAppEndpoint(args) {
  const appName = args.appName ?? deriveCiAppName(args.instance, args.branch);
  const timeoutMs = args.timeoutMs ?? KIT_TIMEOUTS.cliDefault;
  try {
    const stdout = await runDatabricks(["apps", "get", appName, "-o", "json"], {
      profile: args.profile,
      timeout: timeoutMs
    });
    const info = JSON.parse(stdout);
    return {
      appName,
      exists: true,
      url: typeof info.url === "string" ? info.url : void 0
    };
  } catch (err) {
    const msg = err.message;
    if (/RESOURCE_DOES_NOT_EXIST|does not exist or is deleted|App .* does not exist|status:? 404\b/i.test(msg)) {
      return { appName, exists: false, url: void 0 };
    }
    throw err;
  }
}
function deriveCiAppName(instance, branch) {
  const raw = `${instance}-${branch}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return raw.slice(0, 26).replace(/-+$/, "");
}
function runDeploy(args) {
  return new Promise((resolve2, reject) => {
    const child = spawn(
      "databricks",
      [
        "apps",
        "deploy",
        args.appName,
        "--source-code-path",
        args.workspacePath,
        "--profile",
        args.profile
      ],
      { cwd: void 0 }
    );
    let stdout = "";
    let stderr = "";
    let timer;
    let settled = false;
    const finish = (cb) => {
      if (settled) return;
      settled = true;
      if (timer) clearTimeout(timer);
      cb();
    };
    child.stdout?.on("data", (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr?.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    child.on("error", (err) => {
      finish(() => reject(new Error(`databricks apps deploy failed to start: ${err.message}`)));
    });
    child.on("close", (code) => {
      finish(() => resolve2({ ok: code === 0, exitCode: code, stdout, stderr }));
    });
    timer = setTimeout(() => {
      finish(() => {
        child.kill("SIGTERM");
        reject(new Error(`databricks apps deploy timed out after ${args.timeoutMs}ms`));
      });
    }, args.timeoutMs);
  });
}

// scripts/lakebase/deploy-app-yaml.ts
init_esm_shims();
var DEFAULT_COMMAND = ["npm", "run", "start"];
var POSTGRES_VALUE_FROM_ENVS = [
  "PGHOST",
  "PGDATABASE",
  "PGUSER",
  "PGPORT",
  "PGSSLMODE",
  "LAKEBASE_ENDPOINT"
];
function generateAppYaml(target, options = {}) {
  const command = parseCommand(options.existing) ?? options.defaultCommand ?? DEFAULT_COMMAND;
  const env = buildEnvEntries(target);
  return formatAppYaml(command, env);
}
function buildEnvEntries(target) {
  const entries = [];
  for (const name of POSTGRES_VALUE_FROM_ENVS) {
    entries.push({ name, valueFrom: "postgres" });
  }
  entries.push({ name: "LAKEBASE_PROJECT_ID", value: target.lakebase_project });
  entries.push({ name: "LAKEBASE_BRANCH_ID", value: target.lakebase_branch });
  if (target.uc_catalog) entries.push({ name: "UC_CATALOG", value: target.uc_catalog });
  if (target.uc_schema) entries.push({ name: "UC_SCHEMA", value: target.uc_schema });
  if (target.uc_volume) entries.push({ name: "UC_VOLUME", value: target.uc_volume });
  if (target.lakebase_secret_scope) {
    entries.push({ name: "LAKEBASE_SECRET_SCOPE", value: target.lakebase_secret_scope });
  }
  if (target.lakebase_secret_key) {
    entries.push({ name: "LAKEBASE_SECRET_KEY", value: target.lakebase_secret_key });
  }
  if (target.ai_model) entries.push({ name: "AI_MODEL", value: target.ai_model });
  return entries;
}
function parseCommand(existing) {
  if (!existing) return void 0;
  const blockMatch = existing.match(/^command:\s*\n((?:[ \t]+-[ \t]+.+\n?)+)/m);
  if (blockMatch) {
    const parts = blockMatch[1].split("\n").map((line) => line.match(/^[ \t]+-[ \t]+(.+?)[ \t]*$/)?.[1]).filter((s) => typeof s === "string").map(unquote);
    if (parts.length > 0) return parts;
  }
  const flowMatch = existing.match(/^command:[ \t]*\[([^\]]+)\][ \t]*$/m);
  if (flowMatch) {
    return flowMatch[1].split(",").map((s) => unquote(s.trim()));
  }
  return void 0;
}
function unquote(s) {
  if (s.startsWith('"') && s.endsWith('"') || s.startsWith("'") && s.endsWith("'")) {
    return s.slice(1, -1);
  }
  return s;
}
function formatAppYaml(command, env) {
  const lines = [];
  lines.push("command:");
  for (const part of command) {
    lines.push(`  - ${quoteIfNeeded(part)}`);
  }
  lines.push("");
  lines.push("env:");
  for (const e of env) {
    lines.push(`  - name: ${e.name}`);
    if (e.valueFrom !== void 0) {
      lines.push(`    valueFrom: ${e.valueFrom}`);
    } else if (e.value !== void 0) {
      lines.push(`    value: "${escapeDoubleQuoted(e.value)}"`);
    }
  }
  return lines.join("\n") + "\n";
}
function quoteIfNeeded(s) {
  if (/[\s:#\[\]{},&*!|>'"%@`]/.test(s)) {
    return `"${escapeDoubleQuoted(s)}"`;
  }
  return s;
}
function escapeDoubleQuoted(s) {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

// scripts/lakebase/deploy-credentials.ts
init_esm_shims();
async function getAppServicePrincipal(args) {
  const lookup = await getAppEndpoint({
    appName: args.appName,
    profile: args.profile,
    timeoutMs: args.timeoutMs
  });
  if (!lookup.exists || !lookup.info) {
    throw new Error(`App "${args.appName}" not found on profile "${args.profile}"`);
  }
  const info = lookup.info;
  const clientId = typeof info.service_principal_client_id === "string" && info.service_principal_client_id || typeof info.service_principal_id === "string" && info.service_principal_id || "";
  if (!clientId) return void 0;
  const name = typeof info.service_principal_name === "string" ? info.service_principal_name : void 0;
  return { clientId, name };
}
async function grantLakebasePermission(args) {
  const level = args.level ?? "CAN_MANAGE";
  const timeoutMs = args.timeoutMs ?? KIT_TIMEOUTS.cliDefault;
  const payload = JSON.stringify({
    access_control_list: [
      {
        service_principal_name: args.servicePrincipalName,
        permission_level: level
      }
    ]
  });
  await runDatabricks(
    ["api", "patch", `/api/2.0/permissions/database-projects/${args.projectName}`, "--json", payload],
    { profile: args.profile, timeout: timeoutMs }
  );
  return { granted: true };
}
async function propagateCredentials(args) {
  const sp = await getAppServicePrincipal({
    appName: args.appName,
    profile: args.profile,
    timeoutMs: args.timeoutMs
  });
  if (!sp) {
    return { servicePrincipalClientId: void 0, lakebaseGranted: false };
  }
  await grantLakebasePermission({
    profile: args.profile,
    projectName: args.target.lakebase_project,
    servicePrincipalName: sp.clientId,
    level: args.level,
    timeoutMs: args.timeoutMs
  });
  return {
    servicePrincipalClientId: sp.clientId,
    lakebaseGranted: true
  };
}

// scripts/lakebase/deploy-rollback.ts
init_esm_shims();
import { spawn as spawn2 } from "child_process";
async function listAppDeployments(args) {
  const timeoutMs = args.timeoutMs ?? KIT_TIMEOUTS.cliDefault;
  const stdout = await runDatabricks(["apps", "list-deployments", args.appName, "-o", "json"], {
    profile: args.profile,
    timeout: timeoutMs
  });
  const parsed = JSON.parse(stdout);
  if (Array.isArray(parsed)) return parsed;
  if (parsed && typeof parsed === "object") {
    const obj = parsed;
    const arr = obj.app_deployments ?? obj.deployments ?? obj.items;
    if (Array.isArray(arr)) return arr;
  }
  return [];
}
async function rollbackDeploy(args) {
  const timeoutMs = args.timeoutMs ?? 6e5;
  const deployments = await listAppDeployments({
    profile: args.profile,
    appName: args.appName
  });
  let target;
  if (args.deploymentId) {
    target = deployments.find((d) => d.deployment_id === args.deploymentId);
    if (!target) {
      throw new Error(
        `Deployment "${args.deploymentId}" not found among ${deployments.length} deployments for app "${args.appName}"`
      );
    }
  } else {
    const succeeded = deployments.filter((d) => stateOf(d) === "SUCCEEDED");
    if (succeeded.length < 2) {
      throw new Error(
        `App "${args.appName}" has ${succeeded.length} succeeded deployment(s); need at least 2 to auto-rollback`
      );
    }
    target = succeeded[1];
  }
  const sourceCodePath = typeof target.source_code_path === "string" ? target.source_code_path : "";
  if (!sourceCodePath) {
    throw new Error(
      `Target deployment "${target.deployment_id}" has no source_code_path; cannot rollback`
    );
  }
  const toDeploymentId = typeof target.deployment_id === "string" ? target.deployment_id : "";
  const { ok, exitCode, stdout, stderr } = await runRollbackDeploy({
    appName: args.appName,
    sourceCodePath,
    profile: args.profile,
    timeoutMs
  });
  return {
    ok,
    toDeploymentId,
    sourceCodePath,
    exitCode,
    deployStdout: stdout,
    deployStderr: stderr
  };
}
function stateOf(d) {
  return (d.status?.state ?? d.state ?? "").toUpperCase();
}
function runRollbackDeploy(args) {
  return new Promise((resolve2, reject) => {
    const child = spawn2(
      "databricks",
      [
        "apps",
        "deploy",
        args.appName,
        "--source-code-path",
        args.sourceCodePath,
        "--profile",
        args.profile
      ],
      { cwd: void 0 }
    );
    let stdout = "";
    let stderr = "";
    let timer;
    let settled = false;
    const finish = (cb) => {
      if (settled) return;
      settled = true;
      if (timer) clearTimeout(timer);
      cb();
    };
    child.stdout?.on("data", (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr?.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    child.on("error", (err) => {
      finish(() => reject(new Error(`databricks apps deploy (rollback) failed to start: ${err.message}`)));
    });
    child.on("close", (code) => {
      finish(() => resolve2({ ok: code === 0, exitCode: code, stdout, stderr }));
    });
    timer = setTimeout(() => {
      finish(() => {
        child.kill("SIGTERM");
        reject(new Error(`databricks apps deploy (rollback) timed out after ${args.timeoutMs}ms`));
      });
    }, args.timeoutMs);
  });
}

// scripts/lakebase/deploy-targets.ts
init_esm_shims();
import { existsSync as existsSync5, readFileSync as readFileSync5, writeFileSync as writeFileSync3 } from "fs";
import { join as join6 } from "path";
var TARGETS_FILE = "deploy-targets.yaml";
var OPTIONAL_KEYS = [
  "uc_catalog",
  "uc_schema",
  "uc_volume",
  "lakebase_secret_scope",
  "lakebase_secret_key",
  "ai_model"
];
function readTargets(workspaceRoot) {
  const targetsFile = join6(workspaceRoot, TARGETS_FILE);
  if (!existsSync5(targetsFile)) return null;
  return parseTargetsYaml(readFileSync5(targetsFile, "utf-8"));
}
function writeTargets(config, workspaceRoot) {
  const targetsFile = join6(workspaceRoot, TARGETS_FILE);
  let yaml = "targets:\n";
  for (const [name, target] of Object.entries(config.targets)) {
    yaml += `  ${name}:
`;
    yaml += `    workspace_profile: ${target.workspace_profile}
`;
    yaml += `    workspace_path: ${target.workspace_path}
`;
    yaml += `    app_name: ${target.app_name}
`;
    yaml += `    lakebase_project: ${target.lakebase_project}
`;
    yaml += `    lakebase_branch: ${target.lakebase_branch}
`;
    for (const key of OPTIONAL_KEYS) {
      const v = target[key];
      if (v) yaml += `    ${key}: ${v}
`;
    }
  }
  writeFileSync3(targetsFile, yaml);
}
function parseTargetsYaml(content) {
  const targets = {};
  let currentTarget = null;
  for (const rawLine of content.split("\n")) {
    const trimmed = rawLine.trimEnd();
    if (!trimmed || trimmed.startsWith("#")) continue;
    if (trimmed === "targets:") continue;
    const targetMatch = trimmed.match(/^ {2}(\S+):$/);
    if (targetMatch) {
      currentTarget = targetMatch[1];
      targets[currentTarget] = {};
      continue;
    }
    const kvMatch = trimmed.match(/^ {4}(\S+):\s*"?([^"]*)"?\s*$/);
    if (kvMatch && currentTarget) {
      const key = kvMatch[1];
      targets[currentTarget][key] = kvMatch[2];
    }
  }
  return { targets };
}
function getTargetNames(workspaceRoot) {
  const config = readTargets(workspaceRoot);
  if (!config?.targets) return [];
  return Object.keys(config.targets);
}

// scripts/lakebase/deploy-validate.ts
init_esm_shims();
import { spawn as spawn3 } from "child_process";
function validateApp(opts) {
  const timeoutMs = opts.timeoutMs ?? KIT_TIMEOUTS.cliLong;
  return new Promise((resolve2, reject) => {
    const child = spawn3(
      "databricks",
      ["apps", "validate", "--profile", opts.profile],
      { cwd: opts.workspaceRoot }
    );
    let stdout = "";
    let stderr = "";
    let timer;
    let settled = false;
    const finish = (cb) => {
      if (settled) return;
      settled = true;
      if (timer) clearTimeout(timer);
      cb();
    };
    child.stdout?.on("data", (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr?.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    child.on("error", (err) => {
      finish(() => reject(new Error(`databricks apps validate failed to start: ${err.message}`)));
    });
    child.on("close", (code) => {
      finish(() => resolve2({
        ok: code === 0,
        exitCode: code,
        stdout,
        stderr
      }));
    });
    timer = setTimeout(() => {
      finish(() => {
        child.kill("SIGTERM");
        reject(new Error(`databricks apps validate timed out after ${timeoutMs}ms`));
      });
    }, timeoutMs);
  });
}

// scripts/lakebase/long-running-branch.ts
init_esm_shims();
import * as cp2 from "child_process";
async function createLongRunningBranch(args) {
  const created = await createBranch({
    instance: args.projectId,
    branch: args.name,
    // Long-running tiers (staging, uat, perf, ...) are permanent by
    // definition; without this they'd inherit Lakebase's default
    // expiry and silently disappear.
    noExpiry: true,
    // Forward the workspace host so the branch create runs against the SAME
    // workspace the rest of create used (createLakebaseProject also passes host).
    // Without this the Lakebase CLI resolved auth ambiently , falling back to the
    // DEFAULT profile (often an unrelated/expired workspace), so a `--tiers 2`
    // create would silently fail to cut staging and leave the project prod-only.
    host: args.databricksHost
  });
  const opts = { cwd: args.workTreeDir, stdio: "pipe" };
  cp2.execSync(`git fetch origin ${args.forkFromBranch}`, opts);
  cp2.execSync(`git checkout ${args.forkFromBranch}`, opts);
  cp2.execSync(`git pull --ff-only origin ${args.forkFromBranch}`, opts);
  cp2.execSync(`git branch -f ${args.name} ${args.forkFromBranch}`, opts);
  cp2.execSync(`git push -u origin ${args.name}`, opts);
  cp2.execSync(`git checkout ${args.name}`, opts);
  return {
    lakebaseBranchName: created.name ?? `projects/${args.projectId}/branches/${args.name}`,
    gitBranch: args.name,
    lakebase: created
  };
}

// scripts/lakebase/release.ts
init_esm_shims();
var DEFAULT_TIMEOUT_MS = 6e5;
var DEFAULT_POLL_INTERVAL_MS = 15e3;
function matchesWorkflowFile(run, workflowFile) {
  const stem = workflowFile.replace(/\.ya?ml$/i, "");
  return run.name === stem || run.name.toLowerCase() === stem.toLowerCase() || run.name.includes(stem);
}
var sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function release(args) {
  const workflowFile = args.workflowFile ?? "merge.yml";
  const prWorkflowFile = args.prWorkflowFile ?? "pr.yml";
  const timeoutMs = args.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const prGateTimeoutMs = args.prGateTimeoutMs ?? DEFAULT_TIMEOUT_MS;
  const pollIntervalMs = args.pollIntervalMs ?? DEFAULT_POLL_INTERVAL_MS;
  const requireCiGate = args.requireCiGate ?? true;
  const before = await listWorkflowRuns(args.ownerRepo, 25);
  const mergeBaselineRunId = before.find((r) => matchesWorkflowFile(r, workflowFile))?.id ?? 0;
  const prBaselineRunId = before.find((r) => matchesWorkflowFile(r, prWorkflowFile))?.id ?? 0;
  const url = await createPullRequest({
    ownerRepo: args.ownerRepo,
    headBranch: args.from,
    baseBranch: args.to,
    title: `Release: ${args.from} \u2192 ${args.to} (${args.releaseLabel})`,
    body: `Automated release: promote \`${args.from}\` into \`${args.to}\`. Triggers ${workflowFile} on the ${args.to} push, which runs the substrate-routed lakebase-cut-backup + lakebase-schema-migrate apply against the ${args.to} Lakebase branch.`
  });
  const match = url.match(/\/pull\/(\d+)/);
  if (!match) {
    throw new Error(`Could not extract PR number from: ${url}`);
  }
  const prNumber = parseInt(match[1], 10);
  if (requireCiGate) {
    const prDeadline = Date.now() + prGateTimeoutMs;
    let prGatePassed = false;
    while (Date.now() < prDeadline && !prGatePassed) {
      try {
        const runs = await listWorkflowRuns(args.ownerRepo, 25);
        const candidate = runs.filter((r) => matchesWorkflowFile(r, prWorkflowFile)).filter((r) => r.id > prBaselineRunId).filter((r) => r.event === "pull_request").filter((r) => r.branch === args.from)[0];
        if (candidate && candidate.status === "completed") {
          if (candidate.conclusion !== "success") {
            throw new Error(
              `Release ${args.from} \u2192 ${args.to}: PR #${prNumber} ${prWorkflowFile} concluded with '${candidate.conclusion}'. Refusing to merge.`
            );
          }
          prGatePassed = true;
          break;
        }
      } catch (e) {
        if (e instanceof Error && e.message.includes("Refusing to merge")) {
          throw e;
        }
      }
      await sleep(pollIntervalMs);
    }
    if (!prGatePassed) {
      throw new Error(
        `Release ${args.from} \u2192 ${args.to}: ${prWorkflowFile} did not complete on PR #${prNumber} within ${prGateTimeoutMs / 1e3}s. Refusing to merge.`
      );
    }
  }
  await mergePullRequest({
    ownerRepo: args.ownerRepo,
    pullNumber: prNumber,
    method: "merge",
    deleteRemoteBranch: false
    // long-running source tiers are persistent
  });
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const runs = await listWorkflowRuns(args.ownerRepo, 25);
      const matching = runs.filter((r) => matchesWorkflowFile(r, workflowFile));
      for (const run of matching) {
        if (run.id <= mergeBaselineRunId) continue;
        if (run.branch !== args.to) continue;
        if (run.event !== "push") continue;
        if (run.status === "completed") {
          if (run.conclusion === "success") {
            try {
              await fastForwardBranch({
                ownerRepo: args.ownerRepo,
                branch: args.from,
                toRef: args.to
              });
            } catch (e) {
              const msg = e instanceof Error ? e.message : String(e);
              console.warn(`release: fast-forward of ${args.from} to ${args.to} skipped (${msg})`);
            }
          }
          return {
            prNumber,
            workflowRun: run,
            conclusion: run.conclusion
          };
        }
        break;
      }
    } catch {
    }
    await sleep(pollIntervalMs);
  }
  throw new Error(
    `Release ${args.from} \u2192 ${args.to}: ${workflowFile} did not complete on '${args.to}' push within ${timeoutMs / 1e3}s.`
  );
}

// scripts/lakebase/branch-schema.ts
init_esm_shims();
import { Client as Client2 } from "pg";
var SYSTEM_SCHEMA_FILTER = "c.table_schema NOT IN ('pg_catalog','information_schema') AND c.table_schema NOT LIKE 'pg_%'";
function isAllSchemas(schema) {
  const s = (schema ?? "").trim().toLowerCase();
  return s === "all" || s === "*";
}
function buildSchemaQuery(schema) {
  const cols = "c.table_schema, c.table_name, c.column_name, c.data_type";
  const join35 = "FROM information_schema.columns c JOIN pg_tables t ON c.table_name = t.tablename AND c.table_schema = t.schemaname ";
  if (isAllSchemas(schema)) {
    return {
      text: `SELECT ${cols} ` + join35 + `WHERE ${SYSTEM_SCHEMA_FILTER} ORDER BY c.table_schema, c.table_name, c.ordinal_position`,
      values: []
    };
  }
  const one = (schema ?? "").trim() || "public";
  return {
    text: `SELECT ${cols} ` + join35 + "WHERE c.table_schema = $1 ORDER BY c.table_name, c.ordinal_position",
    values: [one]
  };
}
function schemaObjectName(row, allSchemas) {
  return allSchemas ? `${row.table_schema}.${row.table_name}` : row.table_name;
}
async function queryBranchSchema(args) {
  const branchId = await resolveBranchId({ instance: args.instance, branch: args.branch });
  const ep = await getEndpoint({ instance: args.instance, branch: branchId });
  if (!ep?.host) {
    return [];
  }
  const { token, email } = await mintCredential(endpointPath(args.instance, branchId));
  const database = args.database ?? process.env.PGDATABASE ?? DEFAULT_DATABASE;
  const skipFlyway = args.skipFlyway !== false;
  const client = new Client2({
    host: ep.host,
    port: POSTGRES_PORT,
    database,
    user: email,
    password: token,
    application_name: connectionApplicationName(),
    // transparent consort/<v> or scm-utils/<v> label (see get-connection.ts)
    ssl: { rejectUnauthorized: false },
    // Lakebase managed cert
    connectionTimeoutMillis: KIT_TIMEOUTS.pgConnect,
    statement_timeout: KIT_TIMEOUTS.pgStatement
  });
  const allSchemas = isAllSchemas(args.schema);
  const query = buildSchemaQuery(args.schema);
  try {
    await client.connect();
    const result = await client.query(query.text, query.values);
    const tables = /* @__PURE__ */ new Map();
    for (const row of result.rows) {
      if (!row.table_name) continue;
      if (skipFlyway && row.table_name === "flyway_schema_history") continue;
      const key = schemaObjectName(row, allSchemas);
      if (!tables.has(key)) {
        tables.set(key, []);
      }
      tables.get(key).push({ name: row.column_name, dataType: row.data_type });
    }
    return Array.from(tables.entries()).map(([name, columns]) => ({ name, columns }));
  } finally {
    try {
      await client.end();
    } catch {
    }
  }
}
async function queryBranchTables(args) {
  const schema = await queryBranchSchema(args);
  return schema.map((t) => t.name);
}

// scripts/lakebase/create-preflight.ts
init_esm_shims();
import { spawnSync } from "child_process";
import * as fs5 from "fs";
import * as path5 from "path";
function validateCreateInputs(input) {
  if (input.useGithub && !input.githubOwner) {
    return { ok: false, reason: "GitHub owner is required when creating a GitHub repository" };
  }
  if ((input.tiers === 2 || input.tiers === 3) && !input.useGithub) {
    return {
      ok: false,
      reason: `tiers ${input.tiers} requires a GitHub repository: cutting a long-running tier (staging/dev) pushes its git side to origin. Re-run with a --github-owner, or pair --no-github with --tiers 1 (prod only).`
    };
  }
  if (!input.useGithub && input.dirExists(input.projectDir) && !input.dirIsEmpty(input.projectDir)) {
    return { ok: false, reason: `Directory already exists and is not empty: ${input.projectDir}` };
  }
  return { ok: true };
}
function dirIsEmpty(dir) {
  try {
    return fs5.readdirSync(dir).length === 0;
  } catch {
    return true;
  }
}
function lastLines(s, n = 3) {
  return (s ?? "").trim().split("\n").filter(Boolean).slice(-n).join("; ");
}
async function checkDatabricksAuth(host, run = (args) => runDatabricks(args, { host, timeout: 8e3 })) {
  try {
    await run(["auth", "token", "--force-refresh", "-o", "json"]);
    return { ok: true };
  } catch (err) {
    const e = err;
    return { ok: false, reason: lastLines(e.stderr, 2) || e.message || "databricks auth token failed" };
  }
}
function databricksAuthPrereqMessage(host, reason) {
  const hostFlag = host ? ` --host ${host.replace(/\/+$/, "")}` : "";
  return `Databricks authentication is required before creating a project. Run: databricks auth login${hostFlag}` + (reason ? `
(auth probe failed: ${reason})` : "");
}
function warmAndVerifyKit(projectDir, timeoutMs = 18e4) {
  const lk = path5.join(projectDir, "scripts", "lk");
  if (!fs5.existsSync(lk)) {
    return { ok: false, reason: "scripts/lk shim missing from the scaffold" };
  }
  const warm = spawnSync("bash", [lk, "--warm"], { cwd: projectDir, encoding: "utf-8", timeout: timeoutMs });
  if (warm.status !== 0) {
    return { ok: false, reason: lastLines(warm.stderr) || `lk --warm exited ${warm.status ?? "(killed)"}` };
  }
  const verify2 = spawnSync("bash", [lk, "lakebase-schema-diff", "--help"], {
    cwd: projectDir,
    encoding: "utf-8",
    timeout: 3e4,
    env: { ...process.env, LK_NO_INSTALL: "1" }
  });
  if (verify2.status !== 0) {
    return {
      ok: false,
      reason: `kit warmed but a CLI did not resolve: ${lastLines(verify2.stderr) || `exit ${verify2.status}`}`
    };
  }
  return { ok: true };
}
function kitWarmWarning(projectDir, reason) {
  return `The Consort toolkit didn't finish downloading during setup: ${reason ?? "unknown reason"}. It's a one-time download; commit-time schema diff stays unavailable until it completes. Finish it now: (cd ${projectDir} && ./scripts/lk --refresh). If it fails again, check network access to github.com / npm.`;
}
async function withLakebaseRollback(opts, fn) {
  try {
    return await fn();
  } catch (err) {
    const del = opts.deleteProject ?? deleteLakebaseProject;
    const report = opts.report ?? (() => {
    });
    report(`Create failed; rolling back Lakebase project ${opts.projectId}...`);
    let rolledBack = false;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        await del({ projectId: opts.projectId, host: opts.host });
        rolledBack = true;
        break;
      } catch (delErr) {
        const m = delErr instanceof Error ? delErr.message : String(delErr);
        if (/not.?found/i.test(m)) {
          rolledBack = true;
          break;
        }
        if (attempt < 3) await new Promise((r) => setTimeout(r, 1e3 * attempt));
      }
    }
    const base = err instanceof Error ? err.message : String(err);
    const suffix = rolledBack ? ` (rolled back the Lakebase project "${opts.projectId}", so you can retry with the same name)` : ` (WARNING: could not roll back the Lakebase project "${opts.projectId}"; purge it before retrying: databricks postgres delete-project ${opts.projectId})`;
    const wrapped = err instanceof Error ? err : new Error(base);
    wrapped.message = `${base}${suffix}`;
    throw wrapped;
  }
}

// scripts/lakebase/create-project.ts
init_esm_shims();
import * as fs18 from "fs";
import * as path17 from "path";

// scripts/lakebase/project-verify.ts
init_esm_shims();
import * as fs6 from "fs";
import * as path6 from "path";
function verifyHooks(projectDir) {
  const hooksDir = path6.join(projectDir, ".git", "hooks");
  return {
    postCheckout: fs6.existsSync(path6.join(hooksDir, "post-checkout")),
    prepareCommitMsg: fs6.existsSync(path6.join(hooksDir, "prepare-commit-msg")),
    prePush: fs6.existsSync(path6.join(hooksDir, "pre-push"))
  };
}
function verifyWorkflows(projectDir) {
  const wfDir = path6.join(projectDir, ".github", "workflows");
  return {
    pr: fs6.existsSync(path6.join(wfDir, "pr.yml")),
    merge: fs6.existsSync(path6.join(wfDir, "merge.yml"))
  };
}
function verifyProject(projectDir) {
  const hooks = verifyHooks(projectDir);
  const workflows = verifyWorkflows(projectDir);
  const warnings = [];
  if (!hooks.postCheckout || !hooks.prepareCommitMsg || !hooks.prePush) {
    warnings.push("Some git hooks not installed (post-checkout / prepare-commit-msg / pre-push)");
  }
  if (!workflows.pr || !workflows.merge) {
    warnings.push("Some GitHub Actions workflows missing (pr.yml / merge.yml)");
  }
  return { hooks, workflows, warnings };
}

// scripts/git/clone.ts
init_esm_shims();
async function cloneRepo(args) {
  await exec2(`git clone ${shq(args.repoUrl)}`, {
    cwd: args.parentDir,
    timeout: args.timeoutMs ?? 6e4
  });
}

// scripts/git/init.ts
init_esm_shims();
async function gitInit(projectDir) {
  await exec2("git init -b main", { cwd: projectDir, timeout: 15e3 });
}

// scripts/git/commit-push.ts
init_esm_shims();
var WorkflowScopeError = class extends Error {
  constructor(projectDir) {
    super(
      `Push rejected: GitHub token lacks the \`workflow\` OAuth scope required for commits touching \`.github/workflows/*\`. The project on disk is fine; only the initial push failed.

To finish:
  1. Re-sign in to GitHub in VS Code and grant the workflow scope (or set      GITHUB_TOKEN to a token with workflow scope)
  2. Then from the project dir:  cd ${projectDir} && git push -u origin main`
    );
    this.name = "WorkflowScopeError";
  }
};
async function commitAndPush(args) {
  await exec2("git add -A", { cwd: args.projectDir });
  await exec2(`git commit -m ${JSON.stringify(args.message)}`, {
    cwd: args.projectDir,
    timeout: 3e4
  });
  if (args.push === false) return;
  const remote = args.remote ?? "origin";
  const branch = args.branch ?? "main";
  try {
    await exec2(`git push -u ${remote} ${branch}`, {
      cwd: args.projectDir,
      timeout: 3e4
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (/without `?workflow`? scope|workflow scope/i.test(msg)) {
      throw new WorkflowScopeError(args.projectDir);
    }
    throw err;
  }
}

// scripts/lakebase/scaffold.ts
init_esm_shims();
import * as cp3 from "child_process";
import * as fs12 from "fs";
import * as path11 from "path";
import { fileURLToPath as fileURLToPath5 } from "url";

// scripts/lakebase/scaffold-language.ts
init_esm_shims();
import * as fs11 from "fs";
import * as path10 from "path";
import { fileURLToPath as fileURLToPath4 } from "url";

// scripts/util/copy-dir-substituted.ts
init_esm_shims();
import * as fs7 from "fs";
import * as path7 from "path";
var SKIP_ENTRIES = /* @__PURE__ */ new Set([".gitignore.extra", "fallback"]);
function copyDirSubstituted(srcDir, destDir, args = {}) {
  const skip = args.skipEntries ?? SKIP_ENTRIES;
  fs7.mkdirSync(destDir, { recursive: true });
  for (const file of fs7.readdirSync(srcDir)) {
    if (skip.has(file)) continue;
    const srcPath = path7.join(srcDir, file);
    const destPath = path7.join(destDir, file);
    if (fs7.statSync(srcPath).isDirectory()) {
      copyDirSubstituted(srcPath, destPath, { projectName: args.projectName, skipEntries: /* @__PURE__ */ new Set() });
    } else {
      let content = fs7.readFileSync(srcPath, "utf-8");
      if (args.projectName) {
        content = content.replace(/\{\{PROJECT_NAME\}\}/g, args.projectName);
      }
      fs7.writeFileSync(destPath, content);
    }
  }
}

// scripts/lakebase/spring-initializr.ts
init_esm_shims();
import * as fs10 from "fs";
import * as path9 from "path";
import { fileURLToPath as fileURLToPath3 } from "url";

// scripts/util/maven-coords.ts
init_esm_shims();
function sanitizeArtifactId(name) {
  let id = name.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  if (!id) {
    id = "demo";
  }
  if (/^[0-9]/.test(id)) {
    id = `app-${id}`;
  }
  return id;
}

// scripts/util/zip-extract.ts
init_esm_shims();
import * as fs8 from "fs";
import * as path8 from "path";
import AdmZip from "adm-zip";
function extractZipToDir(zipBuffer, targetDir) {
  fs8.mkdirSync(targetDir, { recursive: true });
  const zip = new AdmZip(zipBuffer);
  const tempDir = path8.join(targetDir, `.initializr-extract-${Date.now()}`);
  zip.extractAllTo(tempDir, true);
  const entries = fs8.readdirSync(tempDir).filter((e) => e !== "__MACOSX");
  const sourceDir = entries.length === 1 && fs8.statSync(path8.join(tempDir, entries[0])).isDirectory() ? path8.join(tempDir, entries[0]) : tempDir;
  copyDirRecursive(sourceDir, targetDir);
  fs8.rmSync(tempDir, { recursive: true, force: true });
}
function copyDirRecursive(src, dest) {
  fs8.mkdirSync(dest, { recursive: true });
  for (const entry of fs8.readdirSync(src)) {
    const srcPath = path8.join(src, entry);
    const destPath = path8.join(dest, entry);
    if (fs8.statSync(srcPath).isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs8.copyFileSync(srcPath, destPath);
    }
  }
}

// scripts/util/pom-patch.ts
init_esm_shims();
import * as fs9 from "fs";
var FLYWAY_PG_DEPENDENCY = `
        <dependency>
            <groupId>org.flywaydb</groupId>
            <artifactId>flyway-database-postgresql</artifactId>
        </dependency>`;
var LAKEBASE_PLUGINS = `
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-surefire-plugin</artifactId>
                <configuration>
                    <argLine>--enable-native-access=ALL-UNNAMED -XX:+EnableDynamicAgentLoading</argLine>
                </configuration>
            </plugin>
            <plugin>
                <groupId>org.flywaydb</groupId>
                <artifactId>flyway-maven-plugin</artifactId>
                <configuration>
                    <url>\${env.SPRING_DATASOURCE_URL}</url>
                    <user>\${env.SPRING_DATASOURCE_USERNAME}</user>
                    <password>\${env.SPRING_DATASOURCE_PASSWORD}</password>
                    <baselineOnMigrate>true</baselineOnMigrate>
                    <baselineVersion>0</baselineVersion>
                </configuration>
            </plugin>`;
function patchPomForLakebase(pomPath) {
  if (!fs9.existsSync(pomPath)) {
    throw new Error(`pom.xml not found at ${pomPath}`);
  }
  let pom = fs9.readFileSync(pomPath, "utf-8");
  if (!pom.includes("flyway-database-postgresql")) {
    pom = pom.replace("</dependencies>", `${FLYWAY_PG_DEPENDENCY}
    </dependencies>`);
  }
  if (!pom.includes("flyway-maven-plugin")) {
    if (pom.includes("<artifactId>spring-boot-maven-plugin</artifactId>")) {
      pom = pom.replace(
        /(<plugin>\s*<groupId>org\.springframework\.boot<\/groupId>\s*<artifactId>spring-boot-maven-plugin<\/artifactId>\s*<\/plugin>)/,
        `$1${LAKEBASE_PLUGINS}`
      );
    } else if (pom.includes("</plugins>")) {
      pom = pom.replace("</plugins>", `${LAKEBASE_PLUGINS}
        </plugins>`);
    }
  } else if (!pom.includes("maven-surefire-plugin")) {
    pom = pom.replace(
      "</plugins>",
      `
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-surefire-plugin</artifactId>
                <configuration>
                    <argLine>--enable-native-access=ALL-UNNAMED -XX:+EnableDynamicAgentLoading</argLine>
                </configuration>
            </plugin>
        </plugins>`
    );
  }
  fs9.writeFileSync(pomPath, pom);
}

// scripts/lakebase/spring-initializr.ts
var InitializrNetworkError = class extends Error {
  cause;
  constructor(message, cause) {
    super(message);
    this.name = "InitializrNetworkError";
    this.cause = cause;
  }
};
var InitializrParseError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "InitializrParseError";
  }
};
var METADATA_ACCEPT = "application/vnd.initializr.v2.3+json";
var CACHE_TTL_MS = KIT_TIMEOUTS.initializrCacheTtl;
var DEFAULT_BASE_URL = KIT_REGISTRIES.springInitializr;
var DEPENDENCIES = "web,data-jpa,postgresql,flyway";
function isPrereleaseBootVersion(version) {
  const upper = version.toUpperCase();
  return upper.includes("SNAPSHOT") || /-(RC|M)\d/i.test(version) || /-(ALPHA|BETA)\d/i.test(version);
}
function resolveLatestBootVersion(section) {
  if (!section || typeof section !== "object") {
    throw new InitializrParseError("Missing bootVersion in Spring Initializr metadata");
  }
  const bootSection = section;
  const values = bootSection.values || [];
  for (const entry of values) {
    if (typeof entry.id === "string" && entry.id && !isPrereleaseBootVersion(entry.id)) {
      return entry.id;
    }
  }
  if (typeof bootSection.default === "string" && bootSection.default) {
    return bootSection.default;
  }
  throw new InitializrParseError("No Spring Boot version found in Initializr metadata");
}
function isLtsJavaVersion(version) {
  const n = Number.parseInt(version, 10);
  if (Number.isNaN(n)) return false;
  if (n === 8 || n === 11) return true;
  return n >= 17 && (n - 17) % 4 === 0;
}
function resolveLatestLtsJavaVersion(section) {
  if (!section || typeof section !== "object") {
    throw new InitializrParseError("Missing javaVersion in Spring Initializr metadata");
  }
  const javaSection = section;
  const available = /* @__PURE__ */ new Set();
  if (typeof javaSection.default === "string" && javaSection.default) {
    available.add(javaSection.default);
  }
  for (const entry of javaSection.values || []) {
    if (typeof entry.id === "string" && entry.id) {
      available.add(entry.id);
    }
  }
  let latest = -1;
  let latestId = "";
  for (const id of available) {
    if (!isLtsJavaVersion(id)) continue;
    const n = Number.parseInt(id, 10);
    if (n > latest) {
      latest = n;
      latestId = id;
    }
  }
  if (latestId) return latestId;
  if (typeof javaSection.default === "string" && javaSection.default) {
    return javaSection.default;
  }
  throw new InitializrParseError("No Java version found in Initializr metadata");
}
var SpringInitializrClient = class {
  metadataCache;
  baseUrl;
  fetchFn;
  constructor(baseUrl = DEFAULT_BASE_URL, fetchFn = globalThis.fetch.bind(globalThis)) {
    this.baseUrl = baseUrl;
    this.fetchFn = fetchFn;
  }
  async getMetadata(forceRefresh = false) {
    if (!forceRefresh && this.metadataCache && Date.now() - this.metadataCache.fetchedAt < CACHE_TTL_MS) {
      return this.metadataCache.metadata;
    }
    const url = this.baseUrl.replace(/\/$/, "") + "/";
    let response;
    try {
      response = await this.fetchFn(url, { headers: { Accept: METADATA_ACCEPT } });
    } catch (err) {
      throw new InitializrNetworkError(`Failed to reach Spring Initializr at ${this.baseUrl}`, err);
    }
    if (!response.ok) {
      throw new InitializrNetworkError(`Spring Initializr metadata request failed (${response.status})`);
    }
    let body;
    try {
      body = await response.json();
    } catch {
      throw new InitializrParseError("Spring Initializr metadata response was not valid JSON");
    }
    const metadata = parseMetadata(body);
    this.metadataCache = { metadata, fetchedAt: Date.now() };
    return metadata;
  }
  async generateMavenProject(opts) {
    const metadata = await this.getMetadata(true);
    const artifactId = sanitizeArtifactId(opts.artifactId);
    const params = new URLSearchParams({
      type: "maven-project",
      language: opts.language,
      bootVersion: metadata.bootVersion,
      javaVersion: metadata.javaVersion,
      packaging: "jar",
      dependencies: DEPENDENCIES,
      groupId: opts.groupId || "com.example",
      artifactId,
      name: opts.name || artifactId,
      packageName: opts.packageName || "com.example.demo",
      description: opts.description || "Spring Boot + JPA + PostgreSQL with Flyway; database branches via Lakebase.",
      version: "1.0.0-SNAPSHOT"
    });
    const url = `${this.baseUrl.replace(/\/$/, "")}/starter.zip?${params.toString()}`;
    let response;
    try {
      response = await this.fetchFn(url);
    } catch (err) {
      throw new InitializrNetworkError("Failed to download project from Spring Initializr", err);
    }
    if (!response.ok) {
      throw new InitializrNetworkError(`Spring Initializr project generation failed (${response.status})`);
    }
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }
};
function parseMetadata(body) {
  if (!body || typeof body !== "object") {
    throw new InitializrParseError("Spring Initializr metadata response was empty");
  }
  const doc = body;
  return {
    bootVersion: resolveLatestBootVersion(doc.bootVersion),
    javaVersion: resolveLatestLtsJavaVersion(doc.javaVersion)
  };
}
var cachedTemplatesDir;
function findTemplatesDir() {
  if (cachedTemplatesDir) return cachedTemplatesDir;
  const here = path9.dirname(fileURLToPath3(import.meta.url));
  let dir = here;
  for (let i = 0; i < 6; i++) {
    const candidate = path9.join(dir, "templates", "project");
    if (fs10.existsSync(path9.join(candidate, "common", ".gitignore.base"))) {
      cachedTemplatesDir = candidate;
      return cachedTemplatesDir;
    }
    const parent = path9.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  throw new Error("Could not locate templates/project tree");
}
async function deploySpringStarter(args) {
  const language = args.language;
  const label = language === "kotlin" ? "Kotlin" : "Java";
  const report = args.report ?? (() => {
  });
  const templatesDir = args.templatesDir ?? findTemplatesDir();
  const useFallback = process.env.LAKEBASE_SCAFFOLD_FALLBACK === "1";
  if (useFallback) {
    report(`Using bundled ${label} template (LAKEBASE_SCAFFOLD_FALLBACK).`);
    deploySpringFallback(args.targetDir, language, args.projectName, templatesDir);
    deploySpringOverlays(args.targetDir, templatesDir);
    return;
  }
  report(`Fetching Spring Boot project from start.spring.io (${label}).`);
  let initializrExtracted = false;
  try {
    const client = args.initializrClient ?? new SpringInitializrClient();
    const metadata = await client.getMetadata();
    report(
      `Scaffolding Spring Boot ${metadata.bootVersion} (JVM ${metadata.javaVersion}, ${label}).`,
      `bootVersion=${metadata.bootVersion}`
    );
    const zip = await client.generateMavenProject({
      language,
      artifactId: args.projectName || "demo",
      name: args.projectName
    });
    extractZipToDir(zip, args.targetDir);
    initializrExtracted = true;
    const pomPath = path9.join(args.targetDir, "pom.xml");
    if (!fs10.existsSync(pomPath)) {
      throw new Error("Spring Initializr did not produce a Maven project (missing pom.xml)");
    }
    const mvnw = path9.join(args.targetDir, "mvnw");
    if (fs10.existsSync(mvnw)) fs10.chmodSync(mvnw, 493);
    deploySpringOverlays(args.targetDir, templatesDir);
    patchPomForLakebase(pomPath);
  } catch (err) {
    if (initializrExtracted) {
      throw new Error(
        `Spring Initializr project was extracted but post-processing failed: ${err instanceof Error ? err.message : String(err)}`
      );
    }
    const reason = err instanceof InitializrNetworkError ? err.message : String(err);
    report(`Spring Initializr unavailable; using bundled ${label} template.`, reason);
    clearScaffoldArtifacts(args.targetDir);
    deploySpringFallback(args.targetDir, language, args.projectName, templatesDir);
    deploySpringOverlays(args.targetDir, templatesDir);
  }
}
function deploySpringFallback(targetDir, language, projectName, templatesDir) {
  const fallbackDir = path9.join(templatesDir, language, "fallback");
  if (!fs10.existsSync(fallbackDir)) {
    throw new Error(`No fallback template found for language: ${language}`);
  }
  copyDirSubstituted(fallbackDir, targetDir, { projectName });
  const mvnw = path9.join(targetDir, "mvnw");
  if (fs10.existsSync(mvnw)) fs10.chmodSync(mvnw, 493);
}
function deploySpringOverlays(targetDir, templatesDir) {
  const overlayDir = path9.join(templatesDir, "spring");
  if (!fs10.existsSync(overlayDir)) {
    throw new Error(`Spring overlay template not found at ${overlayDir}`);
  }
  copyDirSubstituted(overlayDir, targetDir);
}
function clearScaffoldArtifacts(targetDir) {
  if (!fs10.existsSync(targetDir)) return;
  for (const entry of fs10.readdirSync(targetDir)) {
    if (entry === ".git") continue;
    fs10.rmSync(path9.join(targetDir, entry), { recursive: true, force: true });
  }
}

// scripts/lakebase/scaffold-language.ts
var cachedTemplatesDir2;
function findTemplatesDir2() {
  if (cachedTemplatesDir2) return cachedTemplatesDir2;
  const here = path10.dirname(fileURLToPath4(import.meta.url));
  let dir = here;
  for (let i = 0; i < 6; i++) {
    const candidate = path10.join(dir, "templates", "project");
    if (fs11.existsSync(path10.join(candidate, "common", ".gitignore.base"))) {
      cachedTemplatesDir2 = candidate;
      return cachedTemplatesDir2;
    }
    const parent = path10.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  throw new Error("Could not locate templates/project tree");
}
async function deployLanguageProject(args) {
  if (args.language === "java" || args.language === "kotlin") {
    await deploySpringStarter({
      targetDir: args.targetDir,
      language: args.language,
      projectName: args.projectName,
      templatesDir: args.templatesDir,
      initializrClient: args.initializrClient,
      report: args.report
    });
    return;
  }
  const templatesDir = args.templatesDir ?? findTemplatesDir2();
  const langSrc = path10.join(templatesDir, args.language);
  if (!fs11.existsSync(langSrc)) {
    throw new Error(`No template found for language: ${args.language}`);
  }
  copyDirSubstituted(langSrc, args.targetDir, { projectName: args.projectName });
}

// scripts/lakebase/scaffold.ts
var cachedTemplatesDir3;
function findTemplatesDir3() {
  if (cachedTemplatesDir3) return cachedTemplatesDir3;
  const here = path11.dirname(fileURLToPath5(import.meta.url));
  let dir = here;
  for (let i = 0; i < 6; i++) {
    const candidate = path11.join(dir, "templates", "project");
    if (fs12.existsSync(path11.join(candidate, "common", ".gitignore.base"))) {
      cachedTemplatesDir3 = candidate;
      return cachedTemplatesDir3;
    }
    const parent = path11.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  throw new Error(
    `Could not locate templates/project tree relative to ${here}. Pass explicit { templatesDir } to override.`
  );
}
function templatesRoot(opts) {
  return opts?.templatesDir ?? findTemplatesDir3();
}
function commonDir(opts) {
  return path11.join(templatesRoot(opts), "common");
}
function langDir(language, opts) {
  return path11.join(templatesRoot(opts), language);
}
function clientTemplateDir(opts) {
  return path11.join(templatesRoot(opts), "client");
}
function listFilesRelative(dir, relPrefix = "") {
  const out = [];
  for (const entry of fs12.readdirSync(dir)) {
    const p = path11.join(dir, entry);
    const rel = relPrefix ? path11.join(relPrefix, entry) : entry;
    if (fs12.statSync(p).isDirectory()) out.push(...listFilesRelative(p, rel));
    else out.push(rel);
  }
  return out;
}
function copyDir(srcDir, destDir, makeExecutable, relPrefix = "") {
  if (!fs12.existsSync(srcDir)) {
    throw new Error(`Source directory not found: ${srcDir}`);
  }
  fs12.mkdirSync(destDir, { recursive: true });
  const out = [];
  for (const entry of fs12.readdirSync(srcDir)) {
    const srcPath = path11.join(srcDir, entry);
    const destPath = path11.join(destDir, entry);
    const relPath = relPrefix ? path11.join(relPrefix, entry) : entry;
    if (fs12.statSync(srcPath).isDirectory()) {
      out.push(...copyDir(srcPath, destPath, makeExecutable, relPath));
    } else {
      fs12.copyFileSync(srcPath, destPath);
      if (makeExecutable) {
        fs12.chmodSync(destPath, 493);
      }
      out.push(relPath);
    }
  }
  return out;
}
async function deployScripts(targetDir, opts) {
  return copyDir(path11.join(commonDir(opts), "scripts"), path11.join(targetDir, "scripts"), true);
}
function deployClientProject(targetDir, projectName, opts) {
  const src = clientTemplateDir(opts);
  if (!fs12.existsSync(src)) return [];
  const destDir = path11.join(targetDir, "client");
  copyDirSubstituted(src, destDir, { projectName });
  const baseIgnore = path11.join(destDir, ".gitignore.base");
  if (fs12.existsSync(baseIgnore)) {
    fs12.renameSync(baseIgnore, path11.join(destDir, ".gitignore"));
  }
  return listFilesRelative(destDir).map((r) => path11.join("client", r));
}
async function deployClaudeCommands(targetDir, opts) {
  const src = path11.join(commonDir(opts), ".claude", "commands");
  if (!fs12.existsSync(src)) {
    return { written: [], skipped: [] };
  }
  const destDir = path11.join(targetDir, ".claude", "commands");
  fs12.mkdirSync(destDir, { recursive: true });
  const version = substrateVersion(opts);
  const written = [];
  const skipped = [];
  for (const entry of fs12.readdirSync(src)) {
    if (!entry.endsWith(".md")) continue;
    const relDest = path11.join(".claude", "commands", entry);
    const destPath = path11.join(targetDir, relDest);
    if (fs12.existsSync(destPath) && !opts?.force) {
      skipped.push(relDest);
      continue;
    }
    const before = fs12.readFileSync(path11.join(src, entry), "utf-8");
    const after = before.replace(/\$\{KIT_VERSION_AT_SCAFFOLD\}/g, version);
    fs12.writeFileSync(destPath, after);
    written.push(relDest);
  }
  return { written, skipped };
}
async function deployClaudeAgents(targetDir, opts) {
  const skillsRoot = path11.join(path11.dirname(path11.dirname(templatesRoot(opts))), "skills");
  if (!fs12.existsSync(skillsRoot)) {
    return { written: [], skipped: [] };
  }
  const destDir = path11.join(targetDir, ".claude", "agents");
  const written = [];
  const skipped = [];
  for (const skill of fs12.readdirSync(skillsRoot).sort()) {
    const src = path11.join(skillsRoot, skill, "agents");
    if (!fs12.existsSync(src) || !fs12.statSync(src).isDirectory()) continue;
    for (const entry of fs12.readdirSync(src)) {
      if (!entry.endsWith(".md")) continue;
      const relDest = path11.join(".claude", "agents", entry);
      const destPath = path11.join(targetDir, relDest);
      if (fs12.existsSync(destPath) && !opts?.force) {
        skipped.push(relDest);
        continue;
      }
      fs12.mkdirSync(destDir, { recursive: true });
      fs12.copyFileSync(path11.join(src, entry), destPath);
      written.push(relDest);
    }
  }
  return { written, skipped };
}
function discoverSkills(skillsRoot) {
  if (!fs12.existsSync(skillsRoot)) return [];
  return fs12.readdirSync(skillsRoot).filter((d) => {
    try {
      return fs12.existsSync(path11.join(skillsRoot, d, "SKILL.md"));
    } catch {
      return false;
    }
  }).sort();
}
async function deployClaudeSkills(targetDir, opts) {
  const substrateSkillsRoot = path11.join(path11.dirname(path11.dirname(findTemplatesDir3())), "skills");
  const kitSkillsRoot = path11.join(path11.dirname(path11.dirname(templatesRoot(opts))), "skills");
  const written = [];
  const skipped = [];
  const seen = /* @__PURE__ */ new Set();
  for (const skillsRoot of [substrateSkillsRoot, kitSkillsRoot]) {
    for (const skill of discoverSkills(skillsRoot)) {
      if (seen.has(skill)) continue;
      seen.add(skill);
      const src = path11.join(skillsRoot, skill);
      const relDest = path11.join(".claude", "skills", skill);
      const destPath = path11.join(targetDir, relDest);
      if (fs12.existsSync(destPath) && !opts?.force) {
        skipped.push(relDest);
        continue;
      }
      fs12.mkdirSync(path11.dirname(destPath), { recursive: true });
      fs12.cpSync(src, destPath, { recursive: true });
      written.push(relDest);
    }
  }
  return { written, skipped };
}
async function deployWorkflows(targetDir, opts) {
  const written = copyDir(
    path11.join(commonDir(opts), ".github", "workflows"),
    path11.join(targetDir, ".github", "workflows"),
    false
  );
  substituteWorkflowPlaceholders(
    path11.join(targetDir, ".github", "workflows"),
    opts
  );
  return written;
}
function substrateVersion(opts) {
  try {
    const pkgRoot = path11.dirname(path11.dirname(templatesRoot(opts)));
    const raw = fs12.readFileSync(path11.join(pkgRoot, "package.json"), "utf-8");
    const pkg = JSON.parse(raw);
    return typeof pkg.version === "string" ? pkg.version : "unknown";
  } catch {
    return "unknown";
  }
}
function substituteWorkflowPlaceholders(workflowDir, opts) {
  if (!fs12.existsSync(workflowDir)) return;
  const version = substrateVersion(opts);
  for (const entry of fs12.readdirSync(workflowDir)) {
    if (!entry.endsWith(".yml") && !entry.endsWith(".yaml")) continue;
    const filePath = path11.join(workflowDir, entry);
    const before = fs12.readFileSync(filePath, "utf-8");
    const after = before.replace(/\{\{LAKEBASE_SCM_UTILS_VERSION\}\}/g, version);
    if (after !== before) fs12.writeFileSync(filePath, after);
  }
}
async function installHooks(targetDir) {
  const scriptsDir = path11.join(targetDir, "scripts");
  const gitHooksDir = path11.join(targetDir, ".git", "hooks");
  if (!fs12.existsSync(path11.join(targetDir, ".git"))) {
    throw new Error(`Not a git repo root: ${targetDir}`);
  }
  fs12.mkdirSync(gitHooksDir, { recursive: true });
  cp3.execSync("git config --local core.hooksPath .git/hooks", {
    cwd: targetDir,
    stdio: "pipe"
  });
  const hookPairs = [
    ["post-checkout.sh", "post-checkout"],
    ["prepare-commit-msg.sh", "prepare-commit-msg"],
    ["pre-push.sh", "pre-push"],
    ["post-merge.sh", "post-merge"]
  ];
  const installed = [];
  for (const [srcName, hookName] of hookPairs) {
    const src = path11.join(scriptsDir, srcName);
    if (!fs12.existsSync(src)) continue;
    const dest = path11.join(gitHooksDir, hookName);
    fs12.copyFileSync(src, dest);
    fs12.chmodSync(dest, 493);
    installed.push(hookName);
  }
  return `Installed hooks: ${installed.join(", ") || "none"}`;
}
function renderEnvFromTemplate(args) {
  const src = path11.join(commonDir(args), ".env.example");
  let content = fs12.readFileSync(src, "utf-8");
  if (args.databricksHost) {
    content = content.replace(/DATABRICKS_HOST=.*/, `DATABRICKS_HOST=${args.databricksHost}`);
  }
  if (args.lakebaseProjectId) {
    content = content.replace(/LAKEBASE_PROJECT_ID=.*/, `LAKEBASE_PROJECT_ID=${args.lakebaseProjectId}`);
  }
  return content;
}
async function deployEnvExample(targetDir, args = {}) {
  fs12.writeFileSync(path11.join(targetDir, ".env.example"), renderEnvFromTemplate(args));
}
async function deployEnv(targetDir, args = {}) {
  fs12.writeFileSync(path11.join(targetDir, ".env"), renderEnvFromTemplate(args));
}
async function deployDeployTargets(targetDir, projectName, opts) {
  const src = path11.join(commonDir(opts), "deploy-targets.yaml");
  const dest = path11.join(targetDir, "deploy-targets.yaml");
  if (!fs12.existsSync(src)) return;
  let content = fs12.readFileSync(src, "utf-8");
  if (projectName) {
    content = content.replace(/\{\{PROJECT_NAME\}\}/g, projectName);
  }
  fs12.writeFileSync(dest, content);
}
async function deployVscodeSettings(targetDir, opts) {
  const src = path11.join(commonDir(opts), ".vscode", "settings.json");
  const destDir = path11.join(targetDir, ".vscode");
  fs12.mkdirSync(destDir, { recursive: true });
  fs12.copyFileSync(src, path11.join(destDir, "settings.json"));
}
async function deployGitignore(targetDir, language = "java", opts) {
  const base = fs12.readFileSync(path11.join(commonDir(opts), ".gitignore.base"), "utf-8");
  const extraPath = path11.join(langDir(language, opts), ".gitignore.extra");
  const extra = fs12.existsSync(extraPath) ? fs12.readFileSync(extraPath, "utf-8") : "";
  fs12.writeFileSync(path11.join(targetDir, ".gitignore"), base + "\n" + extra);
}
async function patchWorkflowsForRunnerType(targetDir, runnerType) {
  const workflowDir = path11.join(targetDir, ".github", "workflows");
  if (runnerType === "github-hosted") {
    for (const file of fs12.existsSync(workflowDir) ? fs12.readdirSync(workflowDir) : []) {
      if (!file.endsWith(".yml") && !file.endsWith(".yaml")) continue;
      const filePath = path11.join(workflowDir, file);
      let content = fs12.readFileSync(filePath, "utf-8");
      content = content.replace(/runs-on: self-hosted/g, "runs-on: ubuntu-latest");
      fs12.writeFileSync(filePath, content);
    }
    return;
  }
  const localJdkStep = [
    "- name: Set up JDK (probe local)",
    "        id: jdk-probe",
    "        if: steps.detect-lang.outputs.lang == 'java'",
    "        run: |",
    '          JH=""',
    '          if [ "$(uname)" = "Darwin" ]; then',
    '            JH="$(/usr/libexec/java_home 2>/dev/null || true)"',
    "          elif command -v java >/dev/null 2>&1 && java -version >/dev/null 2>&1; then",
    '            JH="$(dirname $(dirname $(readlink -f $(which java))))"',
    "          fi",
    '          if [ -n "$JH" ] && [ -x "$JH/bin/java" ]; then',
    '            echo "JAVA_HOME=$JH" >> $GITHUB_ENV',
    '            echo "local_jdk=found" >> $GITHUB_OUTPUT',
    '            echo "Using local JDK: $JH"',
    '            "$JH/bin/java" -version',
    "          else",
    '            echo "local_jdk=missing" >> $GITHUB_OUTPUT',
    '            echo "No local JDK; will fall back to actions/setup-java in the next step."',
    "          fi",
    "",
    "      - name: Set up JDK (download via actions/setup-java fallback)",
    "        if: steps.detect-lang.outputs.lang == 'java' && steps.jdk-probe.outputs.local_jdk == 'missing'",
    "        uses: actions/setup-java@v4",
    "        with:",
    "          java-version: '25'",
    "          distribution: 'temurin'",
    ""
  ].join("\n");
  for (const file of ["pr.yml", "merge.yml"]) {
    const filePath = path11.join(workflowDir, file);
    if (!fs12.existsSync(filePath)) continue;
    let content = fs12.readFileSync(filePath, "utf-8");
    content = content.replace(
      /- name: Set up JDK\n(?:\s+[\w-]+:.*\n)*\s+uses: actions\/setup-java@v4\n\s+with:\n(?:\s+#[^\n]*\n)*(?:\s+[\w-]+:.*\n)+/g,
      localJdkStep
    );
    fs12.writeFileSync(filePath, content);
  }
}
async function scaffoldStaticAll(args) {
  const report = args.report ?? (() => {
  });
  const language = args.language ?? "java";
  const runnerType = args.runnerType ?? "self-hosted";
  const opts = { templatesDir: args.templatesDir };
  report("Deploying .env.example");
  await deployEnvExample(args.targetDir, {
    ...opts,
    databricksHost: args.databricksHost,
    lakebaseProjectId: args.lakebaseProjectId
  });
  report("Deploying .env");
  await deployEnv(args.targetDir, {
    ...opts,
    databricksHost: args.databricksHost,
    lakebaseProjectId: args.lakebaseProjectId
  });
  report("Deploying .vscode/settings.json");
  await deployVscodeSettings(args.targetDir, opts);
  report("Deploying deploy-targets.yaml");
  await deployDeployTargets(args.targetDir, args.lakebaseProjectId, opts);
  report("Deploying .gitignore", language);
  await deployGitignore(args.targetDir, language, opts);
  report("Deploying scripts/");
  const scripts = await deployScripts(args.targetDir, opts);
  report("Deploying .github/workflows/");
  const workflows = await deployWorkflows(args.targetDir, opts);
  report("Patching workflows for runner type", runnerType);
  await patchWorkflowsForRunnerType(args.targetDir, runnerType);
  report("Installing git hooks");
  const hooksInstalled = await installHooks(args.targetDir);
  let claudeCommands = [];
  let claudeAgents = [];
  let claudeSkills = [];
  if (!args.skipCommands) {
    report("Deploying .claude/commands/");
    const cmd = await deployClaudeCommands(args.targetDir, opts);
    claudeCommands = cmd.written;
    report("Deploying .claude/agents/");
    const agents = await deployClaudeAgents(args.targetDir, opts);
    claudeAgents = agents.written;
    const skills = await deployClaudeSkills(args.targetDir, opts);
    claudeSkills = skills.written;
    report(`Deploying .claude/skills/ (${claudeSkills.length} skills)`);
  }
  return { scripts, workflows, hooksInstalled, claudeCommands, claudeAgents, claudeSkills };
}
async function scaffoldAll(args) {
  const report = args.report ?? (() => {
  });
  const language = args.language ?? "java";
  const projectName = args.lakebaseProjectId;
  const staticResult = await scaffoldStaticAll(args);
  report(`Deploying language project (${language})`);
  await deployLanguageProject({
    targetDir: args.targetDir,
    language,
    projectName,
    templatesDir: args.templatesDir,
    initializrClient: args.initializrClient,
    report
  });
  await deployGitignore(args.targetDir, language, { templatesDir: args.templatesDir });
  if (args.clientFramework === "react") {
    report("Deploying React SPA client (client/)");
    const client = deployClientProject(args.targetDir, projectName, {
      templatesDir: args.templatesDir
    });
    if (client.length > 0) staticResult.client = client;
  }
  return staticResult;
}

// scripts/lakebase/enable-e2e.ts
init_esm_shims();
import * as fs14 from "fs";
import * as path13 from "path";

// scripts/lakebase/install-playwright.ts
init_esm_shims();
import * as fs13 from "fs";
import * as path12 from "path";
import { fileURLToPath as fileURLToPath6 } from "url";
var cachedTemplatesDir4;
function findTemplatesDir4() {
  if (cachedTemplatesDir4) return cachedTemplatesDir4;
  const here = path12.dirname(fileURLToPath6(import.meta.url));
  let dir = here;
  for (let i = 0; i < 6; i++) {
    const candidate = path12.join(dir, "templates", "project");
    if (fs13.existsSync(path12.join(candidate, "common", ".gitignore.base"))) {
      cachedTemplatesDir4 = candidate;
      return cachedTemplatesDir4;
    }
    const parent = path12.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  throw new Error(
    `Could not locate templates/project tree relative to ${here}. Pass explicit { templatesDir } to override.`
  );
}
function commonDir2(opts) {
  return path12.join(opts?.templatesDir ?? findTemplatesDir4(), "common");
}
var NODE_E2E_TEMPLATE_FILES = [
  "playwright.config.ts",
  path12.join("tests", "e2e", "smoke.spec.ts")
];
var PYTHON_E2E_TEMPLATE_FILES = [
  path12.join("tests", "e2e", "conftest.py")
];
var PLAYWRIGHT_TEMPLATE_FILES = [
  ...NODE_E2E_TEMPLATE_FILES,
  ...PYTHON_E2E_TEMPLATE_FILES
];
function writePlaywrightTemplates(args) {
  const src = commonDir2(args);
  const written = [];
  const skipped = [];
  for (const rel of args.files ?? PLAYWRIGHT_TEMPLATE_FILES) {
    const from = path12.join(src, rel);
    if (!fs13.existsSync(from)) {
      throw new Error(`Kit template missing: ${from}`);
    }
    const to = path12.join(args.projectDir, rel);
    if (fs13.existsSync(to) && !args.force) {
      skipped.push(rel);
      continue;
    }
    fs13.mkdirSync(path12.dirname(to), { recursive: true });
    fs13.copyFileSync(from, to);
    written.push(rel);
  }
  return { written, skipped };
}
async function runPlaywrightInstall(args) {
  const timeoutMs = args.timeoutMs ?? KIT_TIMEOUTS.cliLong;
  await exec2("npm install --save-dev @playwright/test", {
    cwd: args.projectDir,
    timeout: timeoutMs
  });
  await exec2("npx --yes playwright install chromium", {
    cwd: args.projectDir,
    timeout: timeoutMs
  });
  const version = await exec2("npx --yes playwright --version", {
    cwd: args.projectDir,
    timeout: KIT_TIMEOUTS.cliDefault
  });
  return { version, browserInstalled: true };
}
async function installPlaywright(args) {
  const templates = writePlaywrightTemplates(args);
  if (args.skipBrowserInstall) {
    return { templates };
  }
  const install = await runPlaywrightInstall(args);
  return { templates, install };
}

// scripts/lakebase/enable-e2e.ts
var PLAYWRIGHT_TEST_VERSION_RANGE = "^1.49.0";
var PYTEST_PLAYWRIGHT_VERSION_RANGE = ">=0.5.0";
var PYTEST_BDD_VERSION_RANGE = ">=7.0.0";
function addPlaywrightToPackageJson(args) {
  const pkgPath = path13.join(args.projectDir, "package.json");
  if (!fs14.existsSync(pkgPath)) {
    return { patched: false, scriptAdded: false, depAdded: false };
  }
  const range = args.versionRange ?? PLAYWRIGHT_TEST_VERSION_RANGE;
  const raw = fs14.readFileSync(pkgPath, "utf8");
  const pkg = JSON.parse(raw);
  const scripts = pkg.scripts ?? {};
  const devDependencies = pkg.devDependencies ?? {};
  let scriptAdded = false;
  if (!scripts["test:e2e"]) {
    scripts["test:e2e"] = "playwright test";
    scriptAdded = true;
  }
  let depAdded = false;
  if (!devDependencies["@playwright/test"]) {
    devDependencies["@playwright/test"] = range;
    depAdded = true;
  }
  pkg.scripts = scripts;
  pkg.devDependencies = devDependencies;
  if (scriptAdded || depAdded) {
    const trailingNewline = raw.endsWith("\n") ? "\n" : "";
    fs14.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + trailingNewline, "utf8");
  }
  return { patched: true, scriptAdded, depAdded };
}
function addPythonDevDep(projectDir, pkg, range) {
  const pyPath = path13.join(projectDir, "pyproject.toml");
  if (!fs14.existsSync(pyPath)) {
    return { patched: false, depAdded: false };
  }
  const original = fs14.readFileSync(pyPath, "utf8");
  if (new RegExp(`["']${pkg.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`).test(original)) {
    return { patched: true, depAdded: false };
  }
  const depLine = `    "${pkg}${range}",`;
  const devArray = /(\n[ \t]*dev[ \t]*=[ \t]*\[)([\s\S]*?)(\n[ \t]*\])/;
  if (devArray.test(original)) {
    const patched = original.replace(devArray, (_m, open, body, close) => {
      const sep4 = body.trim() === "" || body.trimEnd().endsWith(",") ? "" : ",";
      return `${open}${body}${sep4}
${depLine}${close}`;
    });
    fs14.writeFileSync(pyPath, patched, "utf8");
    return { patched: true, depAdded: true };
  }
  const trimmed = original.replace(/\n+$/, "\n");
  const block = `
[project.optional-dependencies]
dev = [
${depLine}
]
`;
  fs14.writeFileSync(pyPath, trimmed + block, "utf8");
  return { patched: true, depAdded: true };
}
function ensurePythonE2eDeps(args) {
  return addPythonDevDep(args.projectDir, "pytest-playwright", args.versionRange ?? PYTEST_PLAYWRIGHT_VERSION_RANGE);
}
function ensurePythonBddDeps(args) {
  return addPythonDevDep(args.projectDir, "pytest-bdd", args.versionRange ?? PYTEST_BDD_VERSION_RANGE);
}
var RUN_TESTS_E2E_MARKER = "# run Playwright E2E suite when configured";
var CLIENT_E2E_MARKER = "# run client Playwright E2E suite when configured";
function runTestsE2eBlock() {
  return [
    "",
    RUN_TESTS_E2E_MARKER,
    'if [ -f "$REPO_ROOT/playwright.config.ts" ] || [ -f "$REPO_ROOT/playwright.config.js" ]; then',
    '  echo "Running Playwright E2E tests..."',
    '  if [ -f "$REPO_ROOT/package.json" ] && command -v npm >/dev/null 2>&1; then',
    '    (cd "$REPO_ROOT" && npm run test:e2e)',
    "  else",
    '    (cd "$REPO_ROOT" && npx --yes playwright test)',
    "  fi",
    // Python E2E: pytest-playwright + the shipped tests/e2e/conftest.py
    // (live_server). Gated on the conftest + pyproject so it only fires for a
    // Python project that has the E2E harness, never on a bare API project.
    'elif [ -f "$REPO_ROOT/tests/e2e/conftest.py" ] && [ -f "$REPO_ROOT/pyproject.toml" ]; then',
    '  echo "Running Python E2E tests (pytest tests/e2e)..."',
    // pytest-playwright provides the `page` fixture but needs its browser
    // binaries; install chromium first (idempotent, cached after the first
    // run). Kept under `set -e` so a failed browser install still fails loudly
    // instead of letting pytest error with a bare "Executable doesn't exist".
    '  (cd "$REPO_ROOT" && uv run --extra dev playwright install chromium)',
    // Run the suite with the exit code captured. pytest returns 5 when it
    // collects zero tests; an early story legitimately ships no E2E specs yet
    // (only the scaffolded conftest), so an empty tests/e2e must NOT fail the
    // run, exactly as the marker-split base run treats exit 5. Any other
    // non-zero is a real E2E failure and propagates.
    "  set +e",
    '  (cd "$REPO_ROOT" && uv run --extra dev pytest tests/e2e)',
    "  e2e_rc=$?",
    "  set -e",
    '  if [ "$e2e_rc" -ne 0 ] && [ "$e2e_rc" -ne 5 ]; then exit "$e2e_rc"; fi',
    "fi",
    "",
    CLIENT_E2E_MARKER,
    // A full-stack project keeps its SPA's Playwright under client/ (config +
    // client/tests/e2e/*.spec.ts), which CI runs as its OWN client-gated step. The
    // project-root block above never matches that layout, so without this branch the
    // local deploy-verify SKIPPED the client E2E entirely and failures (a stale
    // scaffold spec, an undeclared `uuid` import) surfaced only in CI, never at the
    // per-story gate. Mirror CI here so local acceptance has E2E parity. A SEPARATE
    // `if` (not elif): a Python/React full-stack app can have BOTH a root/Python E2E
    // AND the client Playwright. reuseExistingServer (the client config: !CI) reuses
    // the app the deploy gate already serves, so there is no rebuild; the browser
    // install is idempotent + cached. --pass-with-no-tests keeps an early story that
    // ships the config but no specs yet from failing on "no tests found".
    'if [ -f "$REPO_ROOT/client/playwright.config.ts" ] || [ -f "$REPO_ROOT/client/playwright.config.js" ] || [ -f "$REPO_ROOT/client/playwright.config.mjs" ]; then',
    '  echo "Running client Playwright E2E tests..."',
    '  (cd "$REPO_ROOT/client" && npx --yes playwright install chromium)',
    '  (cd "$REPO_ROOT/client" && npx --yes playwright test --pass-with-no-tests)',
    "fi",
    ""
  ].join("\n");
}
function addE2eToRunTestsScript(args) {
  const scriptPath = path13.join(args.projectDir, "scripts", "run-tests.sh");
  if (!fs14.existsSync(scriptPath)) {
    return { patched: false, inserted: false };
  }
  const original = fs14.readFileSync(scriptPath, "utf8");
  const hasBase = original.includes(RUN_TESTS_E2E_MARKER);
  const hasClient = original.includes(CLIENT_E2E_MARKER);
  if (hasBase && hasClient) {
    return { patched: true, inserted: false };
  }
  const cut = hasBase ? original.slice(0, original.indexOf(RUN_TESTS_E2E_MARKER)) : original;
  const base = cut.replace(/\n+$/, "\n");
  fs14.writeFileSync(scriptPath, base + runTestsE2eBlock(), "utf8");
  return { patched: true, inserted: true };
}
function enableE2eForProject(args) {
  if (args.clientOwnsE2e) {
    const isPython = args.language === "python" || fs14.existsSync(path13.join(args.projectDir, "pyproject.toml"));
    if (isPython) ensurePythonBddDeps({ projectDir: args.projectDir });
    return {
      templatesWritten: [],
      templatesSkipped: [
        .../* @__PURE__ */ new Set([...PLAYWRIGHT_TEMPLATE_FILES, ...PYTHON_E2E_TEMPLATE_FILES])
      ],
      packageJson: { patched: false, scriptAdded: false, depAdded: false },
      pyproject: { patched: false, depAdded: false },
      runTestsScript: { patched: false, inserted: false }
    };
  }
  const rootPkg = path13.join(args.projectDir, "package.json");
  const isNode = args.language === "nodejs" || args.language === "node" || fs14.existsSync(rootPkg);
  if (!isNode) {
    const isPython = args.language === "python" || fs14.existsSync(path13.join(args.projectDir, "pyproject.toml"));
    const templates2 = isPython ? writePlaywrightTemplates({
      projectDir: args.projectDir,
      force: args.force,
      templatesDir: args.templatesDir,
      files: PYTHON_E2E_TEMPLATE_FILES
    }) : { written: [], skipped: [...PLAYWRIGHT_TEMPLATE_FILES] };
    if (isPython) ensurePythonBddDeps({ projectDir: args.projectDir });
    return {
      templatesWritten: templates2.written,
      templatesSkipped: templates2.skipped,
      // No package.json to wire (the caveat the report surfaces).
      packageJson: { patched: false, scriptAdded: false, depAdded: false },
      // Python: declare the pytest-playwright runner in pyproject's dev extras
      // so the shipped conftest + E2E specs' `page` fixture resolves. (Skipped
      // for other non-Node shapes, which have no pyproject.)
      pyproject: isPython ? ensurePythonE2eDeps({ projectDir: args.projectDir }) : { patched: false, depAdded: false },
      runTestsScript: addE2eToRunTestsScript({ projectDir: args.projectDir })
    };
  }
  const templates = writePlaywrightTemplates({
    projectDir: args.projectDir,
    force: args.force,
    templatesDir: args.templatesDir,
    files: NODE_E2E_TEMPLATE_FILES
  });
  const packageJson = addPlaywrightToPackageJson({
    projectDir: args.projectDir,
    versionRange: args.versionRange
  });
  const runTestsScript = addE2eToRunTestsScript({ projectDir: args.projectDir });
  return {
    templatesWritten: templates.written,
    templatesSkipped: templates.skipped,
    packageJson,
    // Node project: no pyproject to patch.
    pyproject: { patched: false, depAdded: false },
    runTestsScript
  };
}

// scripts/lakebase/enable-infra.ts
init_esm_shims();
import * as fs15 from "fs";
import * as path14 from "path";
var RUN_TESTS_INFRA_MARKER = "# Run Lakebase [Infra]-tag suite when wired";
function addInfraToPackageJson(args) {
  const pkgPath = path14.join(args.projectDir, "package.json");
  if (!fs15.existsSync(pkgPath)) {
    return { patched: false, scriptAdded: false };
  }
  const scriptValue = args.scriptValue ?? "npx --yes lakebase-infra-runner";
  const raw = fs15.readFileSync(pkgPath, "utf8");
  const pkg = JSON.parse(raw);
  const scripts = pkg.scripts ?? {};
  let scriptAdded = false;
  if (!scripts["test:infra"]) {
    scripts["test:infra"] = scriptValue;
    scriptAdded = true;
  }
  pkg.scripts = scripts;
  if (scriptAdded) {
    const trailing = raw.endsWith("\n") ? "\n" : "";
    fs15.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + trailing, "utf8");
  }
  return { patched: true, scriptAdded };
}
function addInfraToRunTestsScript(args) {
  const scriptPath = path14.join(args.projectDir, "scripts", "run-tests.sh");
  if (!fs15.existsSync(scriptPath)) {
    return { patched: false, inserted: false };
  }
  const original = fs15.readFileSync(scriptPath, "utf8");
  if (original.includes(RUN_TESTS_INFRA_MARKER)) {
    return { patched: true, inserted: false };
  }
  const trimmed = original.replace(/\n+$/, "\n");
  const block = [
    "",
    RUN_TESTS_INFRA_MARKER,
    'if [ -f "$REPO_ROOT/package.json" ] && command -v npm >/dev/null 2>&1; then',
    `  if node -e "process.exit(!(require('./package.json').scripts && require('./package.json').scripts['test:infra']))" 2>/dev/null; then`,
    '    echo "Running Lakebase [Infra] suite..."',
    '    (cd "$REPO_ROOT" && npm run test:infra)',
    "  fi",
    "fi",
    ""
  ].join("\n");
  fs15.writeFileSync(scriptPath, trimmed + block, "utf8");
  return { patched: true, inserted: true };
}
function enableInfraForProject(args) {
  const packageJson = addInfraToPackageJson({
    projectDir: args.projectDir,
    scriptValue: args.scriptValue
  });
  const runTestsScript = addInfraToRunTestsScript({ projectDir: args.projectDir });
  return { packageJson, runTestsScript };
}

// scripts/lakebase/runner-setup.ts
init_esm_shims();
import * as fs16 from "fs";
import * as os from "os";
import * as path15 from "path";
import * as cp4 from "child_process";
import * as tar from "tar";
import findJavaHome from "find-java-home";
import treeKill from "tree-kill";
var RUNNER_VERSION = "2.333.1";
var RUNNER_ARCH = process.arch === "arm64" ? "arm64" : "x64";
var RUNNER_OS = process.platform === "darwin" ? "osx" : "linux";
var RUNNER_ARCHIVE = `actions-runner-${RUNNER_OS}-${RUNNER_ARCH}-${RUNNER_VERSION}.tar.gz`;
var RUNNER_URL = `https://github.com/actions/runner/releases/download/v${RUNNER_VERSION}/${RUNNER_ARCHIVE}`;
function cacheDir() {
  return path15.join(os.homedir(), ".cache", "github-actions-runner");
}
function runnersDir() {
  return path15.join(os.homedir(), ".lakebase", "runners");
}
function runnerDir(projectName) {
  return path15.join(runnersDir(), projectName);
}
function runnerName(projectName) {
  return `lakebase-${projectName}`;
}
async function ensureCachedArchive() {
  const dir = cacheDir();
  fs16.mkdirSync(dir, { recursive: true });
  const cachedPath = path15.join(dir, RUNNER_ARCHIVE);
  if (fs16.existsSync(cachedPath)) return cachedPath;
  const response = await fetch(RUNNER_URL);
  if (!response.ok) {
    throw new Error(`Failed to download runner: HTTP ${response.status}`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  fs16.writeFileSync(cachedPath, buffer);
  return cachedPath;
}
async function resolveJavaHome() {
  if (process.env.JAVA_HOME) return process.env.JAVA_HOME;
  return new Promise((resolve2) => {
    findJavaHome((err, javaHome) => resolve2(err ? void 0 : javaHome));
  });
}
function isRunning(projectName) {
  const pidFile = path15.join(runnerDir(projectName), ".pid");
  if (!fs16.existsSync(pidFile)) return false;
  const pid = parseInt(fs16.readFileSync(pidFile, "utf-8").trim(), 10);
  if (!pid) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}
function getRunnerInfo(projectName) {
  const dir = runnerDir(projectName);
  if (!fs16.existsSync(dir)) return void 0;
  const pidFile = path15.join(dir, ".pid");
  let pid;
  if (fs16.existsSync(pidFile)) {
    pid = parseInt(fs16.readFileSync(pidFile, "utf-8").trim(), 10);
  }
  return { name: runnerName(projectName), dir, pid, online: isRunning(projectName) };
}
var lastRunnerPid;
function stopRunner(projectName) {
  const dir = runnerDir(projectName);
  const pidFile = path15.join(dir, ".pid");
  let pid = lastRunnerPid;
  if (fs16.existsSync(pidFile)) {
    pid = parseInt(fs16.readFileSync(pidFile, "utf-8").trim(), 10);
    try {
      fs16.unlinkSync(pidFile);
    } catch {
    }
  }
  if (pid) {
    try {
      treeKill(pid, "SIGKILL");
    } catch {
      try {
        process.kill(pid, "SIGKILL");
      } catch {
      }
    }
  } else if (fs16.existsSync(dir)) {
    try {
      cp4.execSync(`pkill -9 -f "${dir.replace(/\//g, "\\/")}.*Runner" 2>/dev/null || true`, {
        timeout: KIT_TIMEOUTS.cmdShort
      });
    } catch {
    }
  }
  lastRunnerPid = void 0;
  for (const stale of ["_diag/pages", "_work/_temp", "_work/_actions"]) {
    const full = path15.join(dir, stale);
    if (fs16.existsSync(full)) {
      try {
        fs16.rmSync(full, { recursive: true, force: true });
      } catch {
      }
    }
  }
  try {
    fs16.mkdirSync(path15.join(dir, "_diag", "pages"), { recursive: true });
  } catch {
  }
}
function resetRunnerConfig(dir, projectName) {
  const stateFiles = [
    ".runner",
    ".credentials",
    ".credentials_rsaparams",
    ".path",
    ".service",
    "svc.sh",
    ".runner_migrated"
  ];
  for (const f of stateFiles) {
    try {
      fs16.unlinkSync(path15.join(dir, f));
    } catch {
    }
  }
  if (process.platform === "darwin") {
    const plist = path15.join(
      os.homedir(),
      "Library",
      "LaunchAgents",
      `actions.runner.${projectName}.plist`
    );
    if (fs16.existsSync(plist)) {
      try {
        cp4.execFileSync("launchctl", ["unload", plist], { stdio: "ignore" });
      } catch {
      }
      try {
        fs16.unlinkSync(plist);
      } catch {
      }
    }
  }
}
async function setupRunner(args) {
  const report = args.report ?? (() => {
  });
  const dir = runnerDir(args.projectName);
  const name = runnerName(args.projectName);
  stopRunner(args.projectName);
  report("Downloading runner binary...");
  const archive = await ensureCachedArchive();
  fs16.mkdirSync(dir, { recursive: true });
  if (!fs16.existsSync(path15.join(dir, "config.sh"))) {
    report("Extracting runner...");
    await tar.extract({ file: archive, cwd: dir });
  }
  const diagPages = path15.join(dir, "_diag", "pages");
  if (fs16.existsSync(diagPages)) {
    fs16.rmSync(diagPages, { recursive: true, force: true });
    fs16.mkdirSync(diagPages, { recursive: true });
  }
  const runnerFile = path15.join(dir, ".runner");
  let needsConfig = !fs16.existsSync(runnerFile);
  if (needsConfig) {
    resetRunnerConfig(dir, args.projectName);
  } else {
    let urlMismatch = false;
    try {
      const runnerJson = JSON.parse(fs16.readFileSync(runnerFile, "utf-8"));
      const configuredUrl = runnerJson.gitHubUrl || runnerJson.serverUrl || runnerJson.agentUrl || "";
      const expectedUrl = `https://github.com/${args.fullRepoName}`;
      urlMismatch = !!configuredUrl && !configuredUrl.startsWith(expectedUrl);
    } catch {
      urlMismatch = true;
    }
    if (urlMismatch) {
      report("Runner configured against a different repo \u2013 resetting...");
      resetRunnerConfig(dir, args.projectName);
      needsConfig = true;
    } else {
      try {
        const id = await getRunnerIdByName(args.fullRepoName, name);
        if (!id) {
          report("Runner registration stale \u2013 reconfiguring...");
          resetRunnerConfig(dir, args.projectName);
          needsConfig = true;
        } else {
          report("Runner already configured \u2013 restarting...");
        }
      } catch {
        report("Could not verify runner \u2013 reconfiguring...");
        resetRunnerConfig(dir, args.projectName);
        needsConfig = true;
      }
    }
  }
  if (needsConfig) {
    report("Registering runner with GitHub...");
    const regToken = await createRegistrationToken(args.fullRepoName);
    cp4.execSync(
      `./config.sh --url "https://github.com/${args.fullRepoName}" --token "${regToken}" --name "${name}" --labels self-hosted --unattended --replace`,
      { cwd: dir, timeout: KIT_TIMEOUTS.cliLong }
    );
  }
  report("Starting runner...");
  const env = { ...process.env };
  const javaHome = await resolveJavaHome();
  if (javaHome && !env.JAVA_HOME) env.JAVA_HOME = javaHome;
  const child = cp4.spawn("./run.sh", [], {
    cwd: dir,
    detached: true,
    stdio: ["ignore", "ignore", "ignore"],
    env
  });
  child.unref();
  lastRunnerPid = child.pid;
  if (child.pid) {
    fs16.writeFileSync(path15.join(dir, ".pid"), String(child.pid));
  }
  report("Waiting for runner to come online...");
  let online = false;
  for (let i = 0; i < 12; i++) {
    try {
      const status = await getRunnerStatus(args.fullRepoName, name);
      if (status === "online") {
        online = true;
        break;
      }
    } catch {
    }
    await delay(5e3);
  }
  if (!online) {
    throw new Error(`Runner "${name}" did not come online within 60 seconds`);
  }
  report("Runner is online.");
  return { name, dir, pid: child.pid, online: true };
}
async function removeRunner(args) {
  const dir = runnerDir(args.projectName);
  const name = runnerName(args.projectName);
  stopRunner(args.projectName);
  await delay(2e3);
  try {
    const id = await getRunnerIdByName(args.fullRepoName, name);
    if (id) await deleteRunner(args.fullRepoName, id);
  } catch {
  }
  try {
    fs16.rmSync(dir, { recursive: true, force: true });
  } catch {
  }
}

// scripts/util/ci-secrets.ts
init_esm_shims();

// scripts/git/remote.ts
init_esm_shims();
async function getGitHubUrl(cwd) {
  try {
    const raw = (await exec2("git remote get-url origin", { cwd, timeout: 5e3 })).trim();
    if (!raw) {
      return "";
    }
    const url = raw.replace(/\.git$/, "");
    const scp = url.match(/^(?:[^@/]+@)?[^/:]+:([^/].*)$/);
    if (scp) {
      return `https://github.com/${scp[1]}`;
    }
    const ssh = url.match(/^ssh:\/\/(?:[^@/]+@)?[^/]+\/(.+)$/);
    if (ssh) {
      return `https://github.com/${ssh[1]}`;
    }
    const https = url.match(/^https?:\/\/[^/]+\/(.+)$/);
    if (https) {
      return `https://github.com/${https[1]}`;
    }
    return "";
  } catch {
    return "";
  }
}
async function getOwnerRepo(cwd) {
  const url = await getGitHubUrl(cwd);
  if (!url) return "";
  try {
    const { owner, repo } = parseOwnerRepo(url);
    return formatOwnerRepo(owner, repo);
  } catch {
    return "";
  }
}
async function addRemote(args) {
  await exec2(`git remote add ${shq(args.name)} ${shq(args.url)}`, {
    cwd: args.cwd
  });
}
async function removeRemote(args) {
  await exec2(`git remote remove ${shq(args.name)}`, { cwd: args.cwd });
}
async function listRemotes(args) {
  try {
    const raw = await exec2("git remote", { cwd: args.cwd });
    return raw ? raw.split("\n").filter(Boolean) : [];
  } catch {
    return [];
  }
}
async function deleteRemoteBranch(args) {
  const remote = args.remote ?? "origin";
  await exec2(`git push ${remote} --delete ${shq(args.branch)}`, {
    cwd: args.cwd
  });
}

// scripts/util/ci-secrets.ts
async function syncCiSecrets(args) {
  const lifetime = args.lifetimeSeconds ?? 86400;
  const comment = args.comment ?? "GitHub Actions CI";
  const ownerRepo = args.ownerRepo ?? await getOwnerRepo(args.projectDir);
  if (!ownerRepo) {
    throw new Error("Could not resolve GitHub repository from git remote");
  }
  if (!args.databricksHost) {
    throw new Error("syncCiSecrets: databricksHost is required");
  }
  if (!args.lakebaseProjectId) {
    throw new Error("syncCiSecrets: lakebaseProjectId is required");
  }
  const secrets = {
    DATABRICKS_HOST: args.databricksHost,
    LAKEBASE_PROJECT_ID: args.lakebaseProjectId
  };
  try {
    const tokenRaw = await runDatabricks(
      ["tokens", "create", "--comment", comment, "--lifetime-seconds", String(lifetime), "-o", "json"],
      { host: args.databricksHost, cwd: args.projectDir, timeout: 3e4 }
    );
    const parsed = JSON.parse(tokenRaw);
    const token = parsed.token_value || parsed.token || "";
    if (token) secrets.DATABRICKS_TOKEN = token;
  } catch {
  }
  await setRepoSecrets(ownerRepo, secrets);
}

// scripts/lakebase/scm-workflow-state.ts
init_esm_shims();
import * as fs17 from "fs";
import * as path16 from "path";
var SCM_STATES = [
  "scaffold-complete",
  "feature-claimed",
  "pr-ready",
  "ci-green",
  "merged"
];
var STATE_INDEX = SCM_STATES.reduce(
  (acc, s, i) => ({ ...acc, [s]: i }),
  {}
);
var STATE_FILE_REL = ".lakebase/workflow-state.json";
function stateFilePath(projectDir) {
  return path16.join(projectDir, STATE_FILE_REL);
}
function readWorkflowState(projectDir) {
  const p = stateFilePath(projectDir);
  if (!fs17.existsSync(p)) return null;
  const raw = fs17.readFileSync(p, "utf8");
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    throw new Error(
      `Failed to parse ${STATE_FILE_REL}: ${e.message}`
    );
  }
  const result = validateWorkflowState(parsed);
  if (!result.ok) {
    const summary = result.errors.map((e) => `  - ${e.path}: ${e.message}`).join("\n");
    throw new Error(
      `Invalid ${STATE_FILE_REL}:
${summary}

Fix the file or delete it to re-init.`
    );
  }
  return result.value;
}
function isForeignFeatureClaim(scm, featureId) {
  const recorded = scm?.feature_id?.trim().toLowerCase() ?? "";
  const driving = featureId.trim().toLowerCase();
  if (!recorded || !driving) return false;
  return recorded !== driving;
}
function writeWorkflowState(projectDir, state) {
  const result = validateWorkflowState(state);
  if (!result.ok) {
    const summary = result.errors.map((e) => `  - ${e.path}: ${e.message}`).join("\n");
    throw new Error(`Refusing to write invalid SCM state:
${summary}`);
  }
  const dir = path16.join(projectDir, ".lakebase");
  fs17.mkdirSync(dir, { recursive: true });
  const target = stateFilePath(projectDir);
  const tmp = `${target}.tmp`;
  const ordered = orderForOutput(result.value);
  fs17.writeFileSync(tmp, `${JSON.stringify(ordered, null, 2)}
`, "utf8");
  fs17.renameSync(tmp, target);
}
function initWorkflowState(args) {
  return {
    $schema: "./scm-workflow-state.schema.json",
    version: 1,
    state: "scaffold-complete",
    tier_topology: args.tierTopology,
    project_id: args.projectId
  };
}
function validateWorkflowState(value) {
  const errors = [];
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return {
      ok: false,
      errors: [{ path: "$", message: "must be an object" }]
    };
  }
  const v = value;
  if (v.version !== 1) {
    errors.push({ path: "version", message: `must be 1, got ${String(v.version)}` });
  }
  if (typeof v.state !== "string" || !SCM_STATES.includes(v.state)) {
    errors.push({
      path: "state",
      message: `must be one of ${SCM_STATES.join(" | ")}`
    });
  }
  if (v.tier_topology !== 1 && v.tier_topology !== 2 && v.tier_topology !== 3) {
    errors.push({
      path: "tier_topology",
      message: "must be 1, 2, or 3"
    });
  }
  if (typeof v.project_id !== "string" || v.project_id.length === 0) {
    errors.push({
      path: "project_id",
      message: "must be a non-empty string"
    });
  }
  const stringFields = [
    "feature_id",
    "branch",
    "parent_branch",
    "lakebase_branch_uid",
    "claimed_at",
    "pr_url",
    "pushed_at",
    "ci_run_url",
    "ci_green_at",
    "merged_at",
    "migrate_run_url",
    "migrate_completed_at",
    "$schema"
  ];
  for (const key of stringFields) {
    if (v[key] === void 0) continue;
    if (typeof v[key] !== "string" || v[key].length === 0) {
      errors.push({
        path: key,
        message: "must be a non-empty string when present"
      });
    }
  }
  const requiredForState = {
    "scaffold-complete": [],
    "feature-claimed": [
      "feature_id",
      "branch",
      "parent_branch",
      "lakebase_branch_uid",
      "claimed_at"
    ],
    "pr-ready": [
      "feature_id",
      "branch",
      "parent_branch",
      "lakebase_branch_uid",
      "claimed_at",
      "pr_url",
      "pushed_at"
    ],
    "ci-green": [
      "feature_id",
      "branch",
      "parent_branch",
      "lakebase_branch_uid",
      "claimed_at",
      "pr_url",
      "pushed_at",
      "ci_run_url",
      "ci_green_at"
    ],
    merged: [
      "feature_id",
      "branch",
      "parent_branch",
      "lakebase_branch_uid",
      "claimed_at",
      "pr_url",
      "pushed_at",
      "ci_run_url",
      "ci_green_at",
      "merged_at"
    ]
  };
  if (typeof v.state === "string" && SCM_STATES.includes(v.state)) {
    for (const key of requiredForState[v.state]) {
      if (v[key] === void 0) {
        errors.push({
          path: key,
          message: `required when state is "${v.state}"`
        });
      }
    }
  }
  const allowedKeys = /* @__PURE__ */ new Set([
    "$schema",
    "version",
    "state",
    "tier_topology",
    "project_id",
    "feature_id",
    "branch",
    "parent_branch",
    "lakebase_branch_uid",
    "claimed_at",
    "pr_url",
    "pushed_at",
    "ci_run_url",
    "ci_green_at",
    "merged_at",
    "migrate_run_url",
    "migrate_completed_at"
  ]);
  for (const key of Object.keys(v)) {
    if (!allowedKeys.has(key)) {
      errors.push({ path: key, message: "unknown property" });
    }
  }
  if (errors.length > 0) return { ok: false, errors };
  return { ok: true, value: v };
}
function describeGates(state) {
  const currentIdx = STATE_INDEX[state.state];
  return SCM_STATES.map((name) => {
    const idx = STATE_INDEX[name];
    return {
      name,
      passed: idx <= currentIdx,
      current: name === state.state,
      invariants: invariantsForState(state, name)
    };
  });
}
function invariantsForState(state, forState) {
  const inv = [];
  const addIf = (cond, key) => {
    if (!cond) return;
    const raw = state[key];
    inv.push({
      key: String(key),
      present: raw !== void 0,
      value: typeof raw === "string" ? raw : void 0
    });
  };
  if (forState === "scaffold-complete") {
    addIf(true, "project_id");
    addIf(true, "tier_topology");
  }
  if (forState === "feature-claimed") {
    addIf(true, "feature_id");
    addIf(true, "branch");
    addIf(true, "parent_branch");
    addIf(true, "lakebase_branch_uid");
    addIf(true, "claimed_at");
  }
  if (forState === "pr-ready") {
    addIf(true, "pr_url");
    addIf(true, "pushed_at");
  }
  if (forState === "ci-green") {
    addIf(true, "ci_run_url");
    addIf(true, "ci_green_at");
  }
  if (forState === "merged") {
    addIf(true, "merged_at");
  }
  return inv;
}
function orderForOutput(state) {
  const keyOrder = [
    "$schema",
    "version",
    "state",
    "tier_topology",
    "project_id",
    "feature_id",
    "branch",
    "parent_branch",
    "lakebase_branch_uid",
    "claimed_at",
    "pr_url",
    "pushed_at",
    "ci_run_url",
    "ci_green_at",
    "merged_at",
    "migrate_run_url",
    "migrate_completed_at"
  ];
  const out = {};
  for (const k of keyOrder) {
    if (state[k] !== void 0) {
      out[k] = state[k];
    }
  }
  return out;
}

// scripts/lakebase/create-project.ts
async function createProject(input, progress) {
  const report = progress ?? (() => {
  });
  const projectDir = path17.join(input.parentDir, input.projectName);
  const lakebaseProjectId = input.projectName;
  const host = input.databricksHost.replace(/\/+$/, "");
  const useGithub = input.createGithubRepo !== false;
  const language = input.language ?? "java";
  const runnerType = input.runnerType ?? "self-hosted";
  const enableSftdd = input.enableSftdd !== false;
  const uiTrack = input.uiTrack === true;
  const enableE2e = uiTrack || (input.enableE2e !== void 0 ? input.enableE2e : language === "nodejs");
  const clientFramework = input.clientFramework ?? (uiTrack ? "react" : "none");
  if (uiTrack && !enableE2e) {
    throw new Error(
      "create-project: uiTrack requires the e2e harness; a UI project cannot be scaffolded without it."
    );
  }
  const enableInfra = input.enableInfra !== void 0 ? input.enableInfra : language === "nodejs";
  const skipCommands = input.skipCommands === true;
  const tiers = input.tiers;
  const warnings = [];
  {
    const v = validateCreateInputs({
      projectDir,
      useGithub,
      githubOwner: input.githubOwner,
      tiers,
      dirExists: (p) => fs18.existsSync(p),
      dirIsEmpty
    });
    if (!v.ok) throw new Error(v.reason);
  }
  const fullRepoName = input.githubOwner ? `${input.githubOwner}/${input.projectName}` : "";
  {
    const usesGithub = !!input.githubOwner && input.createGithubRepo !== false;
    const tierCount = input.tiers ?? 1;
    const bits = [
      usesGithub ? "GitHub repo" : "local git repo",
      "Lakebase database",
      "project files",
      usesGithub ? "CI service principal + self-hosted runner" : null,
      tierCount > 1 ? `${tierCount} tiers (prod${tierCount >= 2 ? " + staging" : ""}${tierCount >= 3 ? " + dev" : ""})` : null
    ].filter(Boolean);
    report(
      `Setting up "${input.projectName}" , one-time provisioning, usually ~2-4 min. This creates: ${bits.join(", ")}. ${usesGithub ? "The slowest part is the runner setup; that wait is normal. " : ""}Then the Consort toolkit downloads on first use (~1-2 min, one-time). Progress:`
    );
  }
  report("Checking Databricks authentication...");
  const auth7 = await checkDatabricksAuth(host);
  if (!auth7.ok) {
    throw new Error(databricksAuthPrereqMessage(host, auth7.reason));
  }
  if (useGithub) {
    report("Creating GitHub repository...", fullRepoName);
    await createRepo(fullRepoName, {
      private: input.privateRepo !== false,
      description: `Lakebase project: ${input.projectName}`
    });
    report("Waiting for GitHub repo to be visible...", fullRepoName);
    const probeDelays = [1e3, 2e3, 3e3, 5e3, 8e3];
    let probeErr = "";
    let visible = false;
    for (const waitMs of probeDelays) {
      try {
        await getRepoFullName(fullRepoName);
        visible = true;
        break;
      } catch (err) {
        probeErr = err instanceof Error ? err.message : String(err);
        await delay(waitMs);
      }
    }
    if (!visible) {
      let activeUser = "";
      try {
        activeUser = await getCurrentUser();
      } catch {
      }
      const samlHint = /SAML|scope does not match|sso/i.test(probeErr) ? "\n\nThe error mentions SAML \u2013 re-sign in to GitHub and authorize SSO for this org." : "";
      const userHint = activeUser && activeUser !== input.githubOwner ? `

Note: signed in as "${activeUser}", but the repo was created under "${input.githubOwner}".` : "";
      throw new Error(
        `GitHub repo "${fullRepoName}" was created but isn't visible after ~19s of polling.${samlHint}${userHint}

Last probe error:
  ${probeErr.split("\n")[0].slice(0, 200)}`
      );
    }
    report("Cloning repository...", projectDir);
    await cloneRepo({
      repoUrl: `https://github.com/${fullRepoName}.git`,
      parentDir: input.parentDir
    });
  } else {
    report("Creating local project directory...", projectDir);
    fs18.mkdirSync(projectDir, { recursive: true });
    await gitInit(projectDir);
  }
  report("Creating Lakebase database (provisioning Postgres, ~30-60s)...", lakebaseProjectId);
  await createLakebaseProject({ projectId: lakebaseProjectId, host });
  return await withLakebaseRollback(
    { projectId: lakebaseProjectId, host, report },
    async () => {
      report("Resolving database endpoint...");
      const defaultBranchId = await getDefaultBranchId({
        projectId: lakebaseProjectId,
        host
      });
      report("Scaffolding project files...");
      await scaffoldAll({
        targetDir: projectDir,
        databricksHost: host,
        lakebaseProjectId,
        language,
        runnerType,
        skipCommands,
        clientFramework,
        report: (m, d) => report(m, d)
      });
      const consortHooks = input.consortHooks ?? input.sftddHooks;
      if (enableSftdd && consortHooks) {
        report("Scaffolding .consort/ workflow directory...");
        consortHooks.layDownScaffold(projectDir);
      }
      if (enableE2e) {
        report("Wiring Playwright E2E support...");
        const e2e = enableE2eForProject({
          projectDir,
          language,
          clientOwnsE2e: clientFramework !== "none"
        });
        if (e2e.templatesWritten.length > 0) {
          report(`  wrote ${e2e.templatesWritten.length} Playwright template(s)`);
        }
        if (e2e.packageJson.patched && (e2e.packageJson.scriptAdded || e2e.packageJson.depAdded)) {
          report("  patched package.json (test:e2e + @playwright/test)");
        } else if (!e2e.packageJson.patched) {
          report("  package.json absent, skipped npm wiring (non-Node project)");
        }
        if (e2e.runTestsScript.inserted) {
          report("  patched scripts/run-tests.sh");
        }
      }
      if (enableInfra) {
        report("Wiring [Infra]-tag runner support...");
        const infra = enableInfraForProject({ projectDir });
        if (infra.packageJson.patched && infra.packageJson.scriptAdded) {
          report("  patched package.json (test:infra)");
        } else if (!infra.packageJson.patched) {
          report("  package.json absent, skipped npm wiring (non-Node project)");
        }
        if (infra.runTestsScript.inserted) {
          report("  patched scripts/run-tests.sh (infra block)");
        }
      }
      if (useGithub) {
        report("Setting up CI auth (service principal)...");
        try {
          await syncCiSecrets({
            projectDir,
            databricksHost: host,
            lakebaseProjectId,
            comment: "GitHub Actions CI",
            lifetimeSeconds: 86400,
            ownerRepo: fullRepoName
          });
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          warnings.push(`CI auth setup failed: ${msg}`);
          report(`Warning: CI auth setup failed (${msg})`);
        }
      }
      if (useGithub && runnerType === "self-hosted") {
        report("Setting up the self-hosted CI runner (downloads + registers it, ~1-2 min , the slow step)...");
        try {
          await setupRunner({
            fullRepoName,
            projectName: input.projectName,
            report: (m) => report(m)
          });
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          warnings.push(`Runner setup failed: ${msg}`);
          report(`Warning: runner setup failed (${msg}). CI workflows will queue until a runner is available.`);
        }
      } else if (useGithub) {
        report("Using GitHub-hosted runners \u2013 no local runner needed.");
      } else {
        report("Skipping runner setup (no GitHub repository).");
      }
      try {
        writeWorkflowState(
          projectDir,
          initWorkflowState({
            projectId: lakebaseProjectId,
            tierTopology: tiers ?? 1
          })
        );
      } catch (err) {
        warnings.push(
          `SCM workflow-state seed failed (advisory): ${err instanceof Error ? err.message : String(err)}. Run lakebase-scm-state to inspect.`
        );
      }
      if (enableSftdd && consortHooks) {
        try {
          consortHooks.seedConfig(projectDir, {
            agentModels: input.agentModels,
            uiTrack,
            clientFramework
          });
        } catch (err) {
          warnings.push(
            `Consort config seed failed (advisory): ${err instanceof Error ? err.message : String(err)}. The role defaults still apply.`
          );
        }
      }
      {
        const envRef = process.env.LAKEBASE_SCM_UTILS_REF?.trim();
        const ver = substrateVersion();
        const scmRef = envRef || (ver !== "unknown" ? `v${ver}` : "");
        if (scmRef) {
          try {
            const dir = path17.join(projectDir, ".lakebase");
            fs18.mkdirSync(dir, { recursive: true });
            fs18.writeFileSync(path17.join(dir, "scm-utils-ref"), `${scmRef}
`, "utf8");
          } catch (err) {
            warnings.push(`Substrate ref pin failed (advisory): ${err instanceof Error ? err.message : String(err)}.`);
          }
        }
      }
      if (enableSftdd) {
        const kitRef = process.env.LAKEBASE_KIT_REF?.trim();
        if (kitRef) {
          try {
            const dir = path17.join(projectDir, ".lakebase");
            fs18.mkdirSync(dir, { recursive: true });
            fs18.writeFileSync(path17.join(dir, "kit-ref"), `${kitRef}
`, "utf8");
          } catch (err) {
            warnings.push(`Kit ref pin failed (advisory): ${err instanceof Error ? err.message : String(err)}.`);
          }
        }
        report(
          "Consort toolkit downloads on first use (one-time, ~1-2 min) , run `./scripts/lk --refresh`, or just your first `./scripts/lk` command, and it installs then; instant afterward."
        );
      }
      const langLabels = {
        java: "Java/Spring Boot",
        kotlin: "Kotlin/Spring Boot",
        python: "Python/FastAPI",
        nodejs: "Node.js/Express"
      };
      const langLabel = langLabels[language] ?? language;
      report("Creating initial commit...");
      await commitAndPush({
        projectDir,
        message: `Initial project scaffold (${langLabel} + Lakebase)`,
        push: useGithub
      });
      if (tiers === 2 || tiers === 3) {
        report(`Cutting staging tier (tiers=${tiers}) via createLongRunningBranch...`);
        try {
          await createLongRunningBranch({
            name: "staging",
            forkFromBranch: "main",
            projectId: lakebaseProjectId,
            workTreeDir: projectDir,
            databricksHost: host
          });
        } catch (err) {
          warnings.push(
            `INCOMPLETE TIERS: you requested ${tiers} tiers but cutting 'staging' FAILED , the project is prod-only. Cause: ${err instanceof Error ? err.message : String(err)}. Recover WITHOUT re-creating: from the project dir run \`./scripts/lk lakebase-cut-tier --name staging --fork-from main\` (defaults instance + host from .env), then re-check with \`./scripts/lk lakebase-scm-state\`.`
          );
        }
        if (tiers === 3) {
          report("Cutting dev tier (tiers=3) via createLongRunningBranch (off staging)...");
          try {
            await createLongRunningBranch({
              name: "dev",
              forkFromBranch: "staging",
              projectId: lakebaseProjectId,
              workTreeDir: projectDir,
              databricksHost: host
            });
          } catch (err) {
            warnings.push(
              `INCOMPLETE TIERS: you requested 3 tiers but cutting 'dev' FAILED. Cause: ${err instanceof Error ? err.message : String(err)}. Recover WITHOUT re-creating: from the project dir run \`./scripts/lk lakebase-cut-tier --name dev --fork-from staging\`, then re-check with \`./scripts/lk lakebase-scm-state\`.`
            );
          }
        }
      }
      report("Verifying project...");
      const health = verifyProject(projectDir);
      for (const w of health.warnings) {
        warnings.push(w);
        report(`Warning: ${w}`);
      }
      report("Project created successfully!");
      if (enableSftdd) {
        report(`Next: cd ${projectDir} && ./scripts/consort.sh plan`);
      }
      report(`Review the running app: cd ${projectDir} && ./scripts/run-dev.sh`);
      return {
        projectDir,
        githubRepoUrl: useGithub ? `https://github.com/${fullRepoName}` : void 0,
        lakebaseProjectId,
        lakebaseDefaultBranch: defaultBranchId,
        warnings
      };
    }
    // end withLakebaseRollback closure
  );
}

// scripts/lakebase/adopt-lakebase-project.ts
init_esm_shims();
import * as cp5 from "child_process";
import * as fs19 from "fs";
import * as path18 from "path";
async function adoptLakebaseProject(args) {
  const warnings = [];
  const filesWritten = [];
  const dryRun = args.dryRun === true;
  const preserveExistingEnv = args.preserveExistingEnv !== false;
  if (!fs19.existsSync(args.projectDir)) {
    throw new Error(`adoptLakebaseProject: project directory does not exist: ${args.projectDir}`);
  }
  if (!fs19.existsSync(path18.join(args.projectDir, ".git"))) {
    throw new Error(
      `adoptLakebaseProject: ${args.projectDir} is not a git repo. Run \`git init\` first, or pass an existing repo path.`
    );
  }
  if (preserveExistingEnv) {
    assertEnvCompatibility(args.projectDir, args.projectName);
  }
  const host = args.databricksHost.replace(/\/+$/, "");
  await createLakebaseProject({ projectId: args.projectName, host });
  const defaultBranch = await getDefaultBranchId({ projectId: args.projectName, host });
  if (!defaultBranch) {
    warnings.push(
      "Lakebase project created but default branch id is not yet ready. Re-run lakebase-doctor in a moment to confirm; the post-checkout hook will refresh .env when it sees a branch."
    );
  }
  if (!args.skipEnv) {
    if (!dryRun) {
      await deployEnvExample(args.projectDir, {
        databricksHost: host,
        lakebaseProjectId: args.projectName
      });
      await deployEnv(args.projectDir, {
        databricksHost: host,
        lakebaseProjectId: args.projectName
      });
    }
    filesWritten.push(".env", ".env.example");
  }
  const adoptConsortHook = args.adoptConsortHook ?? args.adoptSftddHook;
  if (args.enableSftdd && adoptConsortHook) {
    if (!dryRun) {
      const result = adoptConsortHook(args.projectDir);
      for (const rel of result.added) {
        filesWritten.push(rel);
      }
    } else {
      warnings.push("dryRun: skipped enableSftdd. Re-run without --dry-run to drop the .consort/ scaffold.");
    }
  }
  if (args.enableE2e) {
    if (!dryRun) {
      const result = enableE2eForProject({ projectDir: args.projectDir });
      for (const rel of result.templatesWritten) {
        filesWritten.push(rel);
      }
    } else {
      warnings.push("dryRun: skipped enableE2e. Re-run without --dry-run to wire Playwright.");
    }
  }
  if (args.enableInfra) {
    if (!dryRun) {
      enableInfraForProject({ projectDir: args.projectDir });
      filesWritten.push("scripts/run-tests.sh");
    } else {
      warnings.push("dryRun: skipped enableInfra. Re-run without --dry-run to wire the infra runner.");
    }
  }
  return {
    lakebaseProjectId: args.projectName,
    defaultBranch,
    filesWritten,
    warnings
  };
}
function assertEnvCompatibility(projectDir, expectedProjectId) {
  const envPath = path18.join(projectDir, ".env");
  if (!fs19.existsSync(envPath)) return;
  const content = fs19.readFileSync(envPath, "utf8");
  const match = content.match(/^LAKEBASE_PROJECT_ID\s*=\s*(.+?)\s*$/m);
  if (!match) return;
  const existing = match[1].trim().replace(/^['"]|['"]$/g, "");
  if (existing && existing !== expectedProjectId) {
    throw new Error(
      `adoptLakebaseProject: .env already declares LAKEBASE_PROJECT_ID=${existing}, which differs from the requested project name "${expectedProjectId}". Rebinding is destructive: pass { preserveExistingEnv: false } if you are sure.`
    );
  }
}
function assertAdoptionPreflight(args) {
  if (!fs19.existsSync(args.projectDir)) {
    throw new Error(`assertAdoptionPreflight: project directory does not exist: ${args.projectDir}`);
  }
  if (!fs19.existsSync(path18.join(args.projectDir, ".git"))) {
    throw new Error(
      `assertAdoptionPreflight: ${args.projectDir} is not a git repo.`
    );
  }
  if (args.expectedProjectName) {
    assertEnvCompatibility(args.projectDir, args.expectedProjectName);
  }
}
function _testMakeBrownfieldFixture(opts) {
  fs19.mkdirSync(opts.dir, { recursive: true });
  cp5.execSync("git init --quiet", { cwd: opts.dir, stdio: "pipe" });
  if (opts.packageJson) {
    fs19.writeFileSync(
      path18.join(opts.dir, "package.json"),
      JSON.stringify(opts.packageJson, null, 2) + "\n"
    );
  }
}

// scripts/lakebase/infra-runner.ts
init_esm_shims();
import * as fs27 from "fs";
import * as path27 from "path";

// scripts/lakebase/schema-diff.ts
init_esm_shims();
var IGNORED_TABLES = /* @__PURE__ */ new Set(["flyway_schema_history"]);
async function getSchemaDiff(args) {
  const timestamp = (/* @__PURE__ */ new Date()).toISOString();
  const baseResult = {
    branchName: args.branch,
    comparisonBranchName: "",
    timestamp,
    migrations: [],
    created: [],
    modified: [],
    removed: [],
    branchTables: [],
    inSync: false
  };
  const comparisonBranch = args.comparisonBranch ?? resolveComparisonBranch(args.instance, args.branch);
  if (!comparisonBranch) {
    return { ...baseResult, error: "Could not resolve a comparison target Lakebase branch" };
  }
  if (comparisonBranch === args.branch) {
    return { ...baseResult, comparisonBranchName: comparisonBranch, inSync: true };
  }
  let targetPool;
  let comparisonPool;
  try {
    targetPool = await getConnection({
      output: "pool",
      instance: args.instance,
      branch: args.branch,
      database: args.database,
      workspaceClient: args.workspaceClient
    });
    comparisonPool = await getConnection({
      output: "pool",
      instance: args.instance,
      branch: comparisonBranch,
      database: args.database,
      workspaceClient: args.workspaceClient
    });
    const targetTables = await listTables(targetPool, args.schema);
    const comparisonTables = await listTables(comparisonPool, args.schema);
    return diffSchemas(args.branch, comparisonBranch, targetTables, comparisonTables, timestamp);
  } catch (err) {
    return {
      ...baseResult,
      comparisonBranchName: comparisonBranch,
      error: err instanceof Error ? err.message : String(err)
    };
  } finally {
    if (targetPool) await targetPool.end().catch(() => void 0);
    if (comparisonPool) await comparisonPool.end().catch(() => void 0);
  }
}
async function listTables(pool, schema) {
  const allSchemas = isAllSchemas(schema);
  const query = buildSchemaQuery(schema);
  const { rows } = await pool.query(query.text, query.values);
  const tables = /* @__PURE__ */ new Map();
  for (const r of rows) {
    if (!r.table_name || IGNORED_TABLES.has(r.table_name)) continue;
    const key = schemaObjectName(r, allSchemas);
    if (!tables.has(key)) tables.set(key, []);
    tables.get(key).push({ name: r.column_name, dataType: r.data_type });
  }
  return tables;
}
function diffSchemas(branch, comparisonBranch, target, comparison, timestamp) {
  const created = [];
  const removed = [];
  const modified = [];
  for (const [name, columns] of target) {
    if (!comparison.has(name)) {
      created.push({ type: "TABLE", name, columns });
    }
  }
  for (const [name, columns] of comparison) {
    if (!target.has(name)) {
      removed.push({ type: "TABLE", name, columns });
    }
  }
  for (const [name, targetCols] of target) {
    const comparisonCols = comparison.get(name);
    if (!comparisonCols) continue;
    const comparisonKeys = new Set(comparisonCols.map(colKey));
    const targetKeys = new Set(targetCols.map(colKey));
    const addedColumns = targetCols.filter((c) => !comparisonKeys.has(colKey(c)));
    const removedColumns = comparisonCols.filter((c) => !targetKeys.has(colKey(c)));
    if (addedColumns.length > 0 || removedColumns.length > 0) {
      modified.push({
        type: "TABLE",
        name,
        columns: targetCols,
        addedColumns,
        removedColumns,
        prodColumns: comparisonCols
      });
    }
  }
  const branchTables = [...target.entries()].map(([name, columns]) => ({ type: "TABLE", name, columns })).sort((a, b) => a.name.localeCompare(b.name));
  return {
    branchName: branch,
    comparisonBranchName: comparisonBranch,
    timestamp,
    migrations: [],
    created: created.sort((a, b) => a.name.localeCompare(b.name)),
    modified: modified.sort((a, b) => a.name.localeCompare(b.name)),
    removed: removed.sort((a, b) => a.name.localeCompare(b.name)),
    branchTables,
    inSync: created.length === 0 && modified.length === 0 && removed.length === 0
  };
}
var colKey = (c) => `${c.name}:${c.dataType}`;
function formatSchemaDiffAsMarkdown(result) {
  const lines = ["**SCHEMA CHANGES (Lakebase diff)**", ""];
  if (result.error) {
    lines.push(`Could not compute schema diff: ${result.error}`);
    return lines.join("\n") + "\n";
  }
  const blocks = [];
  for (const obj of result.created) {
    const block = [`+ ${obj.type} ${obj.name} (CREATED)`];
    if (obj.type === "TABLE" && obj.columns) {
      for (const col of obj.columns) {
        block.push(`  L ${col.name} ${col.dataType}`);
      }
    }
    blocks.push(block);
  }
  for (const obj of result.modified) {
    const block = [`~ TABLE ${obj.name} (MODIFIED)`];
    for (const col of obj.addedColumns) {
      block.push(`  + ${col.name} ${col.dataType}`);
    }
    blocks.push(block);
  }
  for (const obj of result.removed) {
    blocks.push([`- ${obj.type} ${obj.name} (REMOVED)`]);
  }
  if (blocks.length === 0) {
    lines.push("No schema changes (in sync).");
  } else {
    for (let i = 0; i < blocks.length; i++) {
      if (i > 0) lines.push("");
      lines.push(...blocks[i]);
    }
  }
  return lines.join("\n") + "\n";
}
function resolveComparisonBranch(instance, branch) {
  const branchInfo = describeBranch(instance, branch);
  const sourceBranch = branchInfo?.status?.source_branch ?? branchInfo?.spec?.source_branch;
  if (sourceBranch && typeof sourceBranch === "string") {
    const leaf = sourceBranch.split("/branches/").pop();
    if (leaf) return leaf;
  }
  const def = findDefaultBranch(instance);
  if (def) return def;
  return void 0;
}
function describeBranch(instance, branch) {
  const branchPath = `projects/${instance}/branches/${branch}`;
  try {
    const raw = dbcli6(["postgres", "get-branch", branchPath, "-o", "json"]);
    return JSON.parse(raw);
  } catch {
    try {
      const raw = dbcli6(["postgres", "list-branches", `projects/${instance}`, "-o", "json"]);
      const parsed = JSON.parse(raw);
      const items = Array.isArray(parsed) ? parsed : parsed.branches ?? parsed.items ?? [];
      return items.find((b) => b.uid === branch || b.name?.endsWith(`/branches/${branch}`));
    } catch {
      return void 0;
    }
  }
}
function findDefaultBranch(instance) {
  try {
    const raw = dbcli6(["postgres", "list-branches", `projects/${instance}`, "-o", "json"]);
    const parsed = JSON.parse(raw);
    const items = Array.isArray(parsed) ? parsed : parsed.branches ?? parsed.items ?? [];
    const def = items.find((b) => b.status?.default === true || b.is_default === true);
    if (!def) return void 0;
    return def.name?.split("/branches/").pop() ?? def.uid ?? void 0;
  } catch {
    return void 0;
  }
}
function dbcli6(args) {
  return runDatabricksSync(args, { timeout: KIT_TIMEOUTS.cliDefault });
}

// scripts/lakebase/schema-migrate.ts
init_esm_shims();
import * as fs26 from "fs";
import * as path26 from "path";

// scripts/lakebase/migration-layout.ts
init_esm_shims();
import * as fs20 from "fs";
import * as path19 from "path";
var MIGRATION_LANGUAGES = [
  "java",
  "kotlin",
  "python",
  "nodejs",
  "unknown"
];
var MIGRATION_DEFAULTS = {
  java: { path: "src/main/resources/db/migration", pattern: /^V\d+.*\.sql$/i, glob: "*.sql" },
  kotlin: { path: "src/main/resources/db/migration", pattern: /^V\d+.*\.sql$/i, glob: "*.sql" },
  python: { path: "alembic/versions", pattern: /^[0-9a-f][\w]*.*\.py$/i, glob: "*.py" },
  nodejs: { path: "migrations", pattern: /^\d+.*\.(js|ts)$/i, glob: "*.{js,ts}" },
  unknown: { path: "src/main/resources/db/migration", pattern: /^V\d+.*\.sql$/i, glob: "*.sql" }
};
function detectLanguageAt(dir) {
  if (fs20.existsSync(path19.join(dir, "pom.xml"))) {
    const kotlinDir = path19.join(dir, "src", "main", "kotlin");
    if (fs20.existsSync(kotlinDir)) {
      return "kotlin";
    }
    try {
      const pom = fs20.readFileSync(path19.join(dir, "pom.xml"), "utf-8");
      if (pom.includes("kotlin-maven-plugin")) {
        return "kotlin";
      }
    } catch {
    }
    return "java";
  }
  if (fs20.existsSync(path19.join(dir, "pyproject.toml")) || fs20.existsSync(path19.join(dir, "requirements.txt")) || fs20.existsSync(path19.join(dir, "alembic.ini"))) {
    return "python";
  }
  if (fs20.existsSync(path19.join(dir, "package.json"))) {
    return "nodejs";
  }
  return "unknown";
}
function resolveMigrationLanguage(projectDir, configuredMigrationPath, override) {
  const ov = (override ?? "").trim().toLowerCase();
  if (ov && ov !== "auto" && MIGRATION_LANGUAGES.includes(ov)) {
    return ov;
  }
  if (!projectDir) {
    return "unknown";
  }
  const atRoot = detectLanguageAt(projectDir);
  if (atRoot !== "unknown") {
    return atRoot;
  }
  const rel = (configuredMigrationPath ?? "").trim();
  if (!rel) {
    return "unknown";
  }
  const rootResolved = path19.resolve(projectDir);
  let dir = path19.resolve(projectDir, rel);
  while (dir === rootResolved || dir.startsWith(rootResolved + path19.sep)) {
    const lang = detectLanguageAt(dir);
    if (lang !== "unknown") {
      return lang;
    }
    const parent = path19.dirname(dir);
    if (parent === dir) {
      break;
    }
    dir = parent;
  }
  return "unknown";
}
function compileMigrationPattern(src) {
  const s = (src ?? "").trim();
  if (!s) {
    return void 0;
  }
  try {
    return new RegExp(s, "i");
  } catch {
    return void 0;
  }
}
function resolveMigrationLayout(args) {
  const configuredMigrationPath = (args.migrationPath ?? "").trim();
  const language = resolveMigrationLanguage(args.projectDir, configuredMigrationPath, args.language);
  const defaults = MIGRATION_DEFAULTS[language];
  return {
    language,
    migrationPath: configuredMigrationPath || defaults.path,
    migrationPattern: compileMigrationPattern(args.migrationPattern) ?? defaults.pattern,
    migrationGlob: (args.migrationGlob ?? "").trim() || defaults.glob
  };
}

// scripts/lakebase/adapters/alembic-adapter.ts
init_esm_shims();
import * as fs22 from "fs";
import * as path21 from "path";

// scripts/lakebase/schema-migrate-runners/alembic.ts
init_esm_shims();
import { spawn as spawn5 } from "child_process";
import * as fs21 from "fs";
import * as path20 from "path";
function resolveAlembicBin(projectDir) {
  const candidates = [
    path20.join(projectDir, ".venv", "bin", "alembic"),
    path20.join(projectDir, "venv", "bin", "alembic")
  ];
  for (const candidate of candidates) {
    try {
      if (fs21.existsSync(candidate)) return candidate;
    } catch {
    }
  }
  return "alembic";
}
function spawnAlembic(projectDir, args, dsn) {
  return new Promise((resolve2, reject) => {
    const bin = resolveAlembicBin(projectDir);
    const env = { ...process.env };
    env.PYTHONPATH = [projectDir, process.env.PYTHONPATH].filter(Boolean).join(path20.delimiter);
    if (dsn) env.DATABASE_URL = dsn;
    const child = spawn5(bin, args, {
      cwd: projectDir,
      env,
      stdio: ["ignore", "pipe", "pipe"]
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString("utf8");
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString("utf8");
    });
    child.on("error", (err) => {
      reject(
        new SchemaMigrationError(
          `Could not spawn alembic. Is it installed and on PATH? ${err.message}`,
          err
        )
      );
    });
    child.on("close", (code) => {
      if (code === 0) {
        resolve2({ stdout, stderr });
      } else {
        reject(
          new SchemaMigrationError(
            `alembic ${args.join(" ")} exited with code ${code}.
stdout: ${stdout}
stderr: ${stderr}`
          )
        );
      }
    });
  });
}
function runAlembic(ctx, args) {
  return spawnAlembic(ctx.projectDir, args, ctx.dsn);
}
async function createAlembicRevision(opts) {
  const args = ["revision", "--rev-id", opts.revId, "-m", opts.message];
  if (opts.autogenerate) args.push("--autogenerate");
  const { stdout } = await spawnAlembic(opts.projectDir, args, opts.dsn);
  const m = stdout.match(/Generating\s+(\S+\.py)/);
  if (m) return m[1].trim();
  for (const rel of ["migrations/versions", "alembic/versions"]) {
    const dir = path20.join(opts.projectDir, rel);
    if (!fs21.existsSync(dir)) continue;
    const hit = fs21.readdirSync(dir).find((f) => f.startsWith(`${opts.revId}_`) && f.endsWith(".py"));
    if (hit) return path20.join(dir, hit);
  }
  throw new SchemaMigrationError(
    `alembic revision succeeded but the created file could not be located.
stdout: ${stdout}`
  );
}
async function listAlembicHeads(projectDir) {
  const { stdout } = await spawnAlembic(projectDir, ["heads"]);
  const heads = [];
  for (const line of stdout.split(/\r?\n/)) {
    const m = line.match(/^([0-9a-f]+)\b/);
    if (m) heads.push(m[1]);
  }
  return heads;
}
async function mergeAlembicHeads(projectDir, message) {
  const { stdout } = await spawnAlembic(projectDir, ["merge", "-m", message, "heads"]);
  const m = stdout.match(/Generating\s+(\S+\.py)/);
  if (!m) {
    throw new SchemaMigrationError(`alembic merge heads created no file.
stdout: ${stdout}`);
  }
  return m[1].trim();
}
async function getCurrentRevision(ctx) {
  const { stdout } = await runAlembic(ctx, ["current"]);
  const m = stdout.match(/^([a-f0-9]+)\b/m);
  return m ? m[1] : void 0;
}
async function getHeadRevision(ctx) {
  const { stdout } = await runAlembic(ctx, ["heads"]);
  const m = stdout.match(/^([a-f0-9]+)\b/m);
  return m ? m[1] : void 0;
}
async function listHistory(ctx, range) {
  const { stdout } = await runAlembic(ctx, ["history", "-r", range]);
  const out = [];
  for (const line of stdout.split(/\r?\n/)) {
    const m = line.match(/^(?:<base>|[a-f0-9]+)\s*->\s*([a-f0-9]+)(?:\s*\(head\))?,\s*(.*)$/);
    if (m) out.push({ version: m[1].trim(), description: m[2].trim() });
  }
  return out;
}
async function applyAlembic(ctx) {
  const before = await getCurrentRevision(ctx);
  await runAlembic(ctx, ["upgrade", "head"]);
  const after = await getCurrentRevision(ctx);
  if (!after || before === after) {
    return { applied: [], alreadyAtLatest: true, tool: "alembic" };
  }
  const range = before ? `${before}:${after}` : `base:${after}`;
  const inRange = await listHistory(ctx, range);
  const applied = before ? inRange.filter((a) => a.version !== before) : inRange;
  return { applied, alreadyAtLatest: false, tool: "alembic" };
}
async function rollbackAlembic(ctx) {
  const before = await getCurrentRevision(ctx);
  if (!before) {
    await runAlembic(ctx, ["downgrade", ctx.target]);
    return { rolledBack: [], tool: "alembic" };
  }
  await runAlembic(ctx, ["downgrade", ctx.target]);
  const after = await getCurrentRevision(ctx);
  const range = after ? `${after}:${before}` : `base:${before}`;
  const inRange = await listHistory(ctx, range);
  const rolledBack = after ? inRange.filter((a) => a.version !== after) : inRange;
  return { rolledBack, tool: "alembic" };
}
async function stampAlembic(ctx) {
  await runAlembic(ctx, ["stamp", "--purge", ctx.revision]);
  return { stamped: ctx.revision, tool: "alembic" };
}
async function statusAlembic(ctx) {
  const current = await getCurrentRevision(ctx);
  const head = await getHeadRevision(ctx);
  const pending = [];
  if (head && head !== current) {
    const range = current ? `${current}:head` : `base:head`;
    const inRange = await listHistory(ctx, range);
    for (const rev of inRange) {
      if (current && rev.version === current) continue;
      pending.push({
        version: rev.version,
        filename: `${rev.version}_*.py`,
        description: rev.description
      });
    }
  }
  return { current, pending, tool: "alembic" };
}

// scripts/lakebase/schema-migration-adapter.ts
init_esm_shims();
var REGISTRY = /* @__PURE__ */ new Map();
function registerSchemaMigrationAdapter(adapter) {
  REGISTRY.set(adapter.id, adapter);
}
function resolveSchemaMigrationAdapter(projectDir, override) {
  if (override) {
    const a = REGISTRY.get(override);
    if (!a) {
      throw new UnresolvedSchemaMigrationAdapterError(
        `migration_tool=${override} is not a registered adapter. Registered: ${[...REGISTRY.keys()].join(", ") || "(none)"}`
      );
    }
    return a;
  }
  for (const adapter of REGISTRY.values()) {
    if (adapter.detect(projectDir)) return adapter;
  }
  throw new UnresolvedSchemaMigrationAdapterError(
    `Cannot resolve migration tool for ${projectDir}. Set project.yaml#migration_tool to one of: ${[...REGISTRY.keys()].join(", ") || "(none)"}.`
  );
}
var UnresolvedSchemaMigrationAdapterError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "UnresolvedSchemaMigrationAdapterError";
  }
};

// scripts/lakebase/adapters/alembic-adapter.ts
async function buildDsn2(args) {
  const result = await getConnection({
    output: "dsn",
    instance: args.instance,
    branch: args.branch,
    database: args.database,
    endpointName: args.endpointName
  });
  return result.url;
}
function findVersionsDir(projectDir) {
  const candidates = [
    path21.join(projectDir, "migrations", "versions"),
    path21.join(projectDir, "alembic", "versions")
  ];
  return candidates.find((p) => fs22.existsSync(p));
}
function listAlembicFiles(projectDir) {
  const dir = findVersionsDir(projectDir);
  if (!dir) return [];
  const files = fs22.readdirSync(dir).filter((f) => f.endsWith(".py") && !f.startsWith("__"));
  return files.map((filename) => {
    const stem = filename.replace(/\.py$/, "");
    const sep4 = stem.indexOf("_");
    const version = sep4 === -1 ? stem : stem.slice(0, sep4);
    const description = sep4 === -1 ? "" : stem.slice(sep4 + 1).replace(/_/g, " ");
    return {
      version,
      filename,
      description,
      type: "Python",
      tool: "alembic"
    };
  }).sort((a, b) => a.filename.localeCompare(b.filename));
}
var AlembicAdapter = {
  id: "alembic",
  languages: ["python"],
  /**
   * Detect Alembic-specifically rather than Python-broadly. A project
   * with pyproject.toml but no alembic.ini and no env.py is a Python
   * project that hasn't (yet) adopted Alembic, and should NOT auto-route
   * here. Callers can still force-select via project.yaml#migration_tool.
   */
  detect(projectDir) {
    if (fs22.existsSync(path21.join(projectDir, "alembic.ini"))) return true;
    if (fs22.existsSync(path21.join(projectDir, "migrations", "env.py"))) return true;
    if (fs22.existsSync(path21.join(projectDir, "alembic", "env.py"))) return true;
    return false;
  },
  async apply(args) {
    const dsn = await buildDsn2(args);
    try {
      const legacy = await applyAlembic({ projectDir: args.projectDir, dsn });
      return {
        applied_migrations: legacy.applied,
        status: legacy.alreadyAtLatest ? "noop" : "ok",
        tool_specific: {
          alreadyAtLatest: legacy.alreadyAtLatest,
          tool: legacy.tool
        }
      };
    } catch (err) {
      return {
        applied_migrations: [],
        status: "error",
        error: err instanceof Error ? err.message : String(err)
      };
    }
  },
  async rollback(args) {
    const dsn = await buildDsn2(args);
    try {
      const legacy = await rollbackAlembic({
        projectDir: args.projectDir,
        dsn,
        target: args.target
      });
      return {
        rolled_back: legacy.rolledBack,
        status: legacy.rolledBack.length === 0 ? "noop" : "ok",
        tool_specific: { tool: legacy.tool }
      };
    } catch (err) {
      return {
        rolled_back: [],
        status: "error",
        error: err instanceof Error ? err.message : String(err)
      };
    }
  },
  async stamp(args) {
    const dsn = await buildDsn2(args);
    try {
      const r = await stampAlembic({ projectDir: args.projectDir, dsn, revision: args.revision });
      return { status: "ok", stamped_revision: r.stamped, tool_specific: { tool: r.tool } };
    } catch (err) {
      return {
        status: "error",
        stamped_revision: null,
        error: err instanceof Error ? err.message : String(err)
      };
    }
  },
  async status(args) {
    const dsn = await buildDsn2(args);
    try {
      const legacy = await statusAlembic({ projectDir: args.projectDir, dsn });
      return {
        applied_version: legacy.current ?? null,
        pending: legacy.pending,
        // The legacy statusAlembic returns current + pending, not the
        // full applied history. Surface what we have. Backfilling the
        // applied list requires an extra `alembic history -r base:current`
        // call; deferred to a follow-up so this slice stays a pure port.
        applied: [],
        status: "ok",
        tool_specific: { tool: legacy.tool }
      };
    } catch (err) {
      return {
        applied_version: null,
        pending: [],
        applied: [],
        status: "error",
        error: err instanceof Error ? err.message : String(err)
      };
    }
  },
  async list(args) {
    return { files: listAlembicFiles(args.projectDir) };
  },
  // baseline intentionally absent in slice 3. Alembic exposes `stamp`
  // as the equivalent operation; deferred to a follow-up.
  async newMigration(args) {
    try {
      if (args.autogenerate && (!args.instance || !args.branch)) {
        throw new Error("autogenerate requires both instance and branch (to diff models vs the branch DB)");
      }
      const revId = migrationTimestamp();
      const dsn = args.autogenerate ? await buildDsn2({
        instance: args.instance,
        branch: args.branch,
        database: args.database,
        endpointName: args.endpointName
      }) : void 0;
      const created = await createAlembicRevision({
        projectDir: args.projectDir,
        revId,
        message: args.slug,
        autogenerate: !!args.autogenerate,
        dsn
      });
      return { status: "ok", version: revId, filename: path21.basename(created), path: created };
    } catch (err) {
      return {
        status: "error",
        version: "",
        filename: "",
        path: "",
        error: err instanceof Error ? err.message : String(err)
      };
    }
  },
  async collapseHeads(args) {
    try {
      const heads = await listAlembicHeads(args.projectDir);
      if (heads.length <= 1) return { status: "noop", headsBefore: heads };
      if (args.dryRun) return { status: "ok", headsBefore: heads };
      const created = await mergeAlembicHeads(args.projectDir, args.message ?? "merge heads");
      const mergeRevision = path21.basename(created).replace(/\.py$/, "").split("_")[0];
      return { status: "ok", headsBefore: heads, mergeRevision, path: created };
    } catch (err) {
      return {
        status: "error",
        headsBefore: [],
        error: err instanceof Error ? err.message : String(err)
      };
    }
  }
};
registerSchemaMigrationAdapter(AlembicAdapter);

// scripts/lakebase/adapters/flyway-adapter.ts
init_esm_shims();
import * as fs23 from "fs";
import * as path23 from "path";

// scripts/lakebase/schema-migrate-runners/flyway.ts
init_esm_shims();
import { spawn as spawn6 } from "child_process";
import * as path22 from "path";
function dsnToFlywayEnv(dsn) {
  const u = new URL(dsn);
  const user = decodeURIComponent(u.username);
  const password = decodeURIComponent(u.password);
  const portPart = u.port ? `:${u.port}` : "";
  const url = `jdbc:postgresql://${u.hostname}${portPart}${u.pathname}${u.search}`;
  return { url, user, password };
}
function migrationsLocation(projectDir) {
  return `filesystem:${path22.join(projectDir, "src", "main", "resources", "db", "migration")}`;
}
function runFlyway(ctx, args) {
  const { url, user, password } = dsnToFlywayEnv(ctx.dsn);
  return new Promise((resolve2, reject) => {
    const child = spawn6(
      "flyway",
      ["-outputType=json", `-locations=${migrationsLocation(ctx.projectDir)}`, ...args],
      {
        cwd: ctx.projectDir,
        env: {
          ...process.env,
          FLYWAY_URL: url,
          FLYWAY_USER: user,
          FLYWAY_PASSWORD: password
        },
        stdio: ["ignore", "pipe", "pipe"]
      }
    );
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString("utf8");
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString("utf8");
    });
    child.on("error", (err) => {
      reject(
        new SchemaMigrationError(
          `Could not spawn flyway. Is the Flyway Community CLI installed and on PATH? ${err.message}`,
          err
        )
      );
    });
    child.on("close", (code) => {
      if (code === 0) {
        resolve2({ stdout, stderr });
      } else {
        reject(
          new SchemaMigrationError(
            `flyway ${args.join(" ")} exited with code ${code}.
stdout: ${stdout}
stderr: ${stderr}`
          )
        );
      }
    });
  });
}
function parseFlywayJson(stdout) {
  const start = stdout.indexOf("{");
  if (start === -1) {
    throw new SchemaMigrationError(`flyway JSON output missing: ${stdout.slice(0, 200)}`);
  }
  try {
    return JSON.parse(stdout.slice(start));
  } catch (err) {
    throw new SchemaMigrationError(
      `flyway JSON parse failed: ${err instanceof Error ? err.message : String(err)}.
Body (first 400 chars): ${stdout.slice(start, start + 400)}`
    );
  }
}
async function applyFlyway(ctx) {
  const { stdout } = await runFlyway(ctx, [
    "-baselineOnMigrate=true",
    "-baselineVersion=0",
    "migrate"
  ]);
  const json = parseFlywayJson(stdout);
  const entries = json.migrations ?? [];
  const applied = [];
  for (const m of entries) {
    if (m.category === "INIT") continue;
    if (m.state && m.state !== "SUCCESS") continue;
    if (!m.version) continue;
    applied.push({
      version: m.version,
      description: m.description ?? "",
      ...typeof m.executionTime === "number" ? { executionTimeMs: m.executionTime } : {}
    });
  }
  return {
    applied,
    alreadyAtLatest: applied.length === 0,
    tool: "flyway"
  };
}
async function statusFlyway(ctx) {
  const { stdout } = await runFlyway(ctx, ["info"]);
  const json = parseFlywayJson(stdout);
  const entries = json.migrations ?? [];
  let current;
  const pending = [];
  for (const m of entries) {
    if (!m.version) continue;
    const state = (m.state ?? "").toUpperCase();
    if (state === "SUCCESS" || state === "BASELINE") {
      current = m.version;
    } else if (state === "PENDING") {
      const filename = m.filepath ? path22.basename(m.filepath) : `V${m.version}__migration.sql`;
      pending.push({
        version: m.version,
        filename,
        description: m.description ?? ""
      });
    }
  }
  return { current, pending, tool: "flyway" };
}

// scripts/lakebase/adapters/flyway-adapter.ts
async function buildDsn3(args) {
  const result = await getConnection({
    output: "dsn",
    instance: args.instance,
    branch: args.branch,
    database: args.database,
    endpointName: args.endpointName
  });
  return result.url;
}
function listFlywayFiles(projectDir) {
  const dir = path23.join(projectDir, "src", "main", "resources", "db", "migration");
  if (!fs23.existsSync(dir)) return [];
  const files = fs23.readdirSync(dir).filter((f) => /^V\d+(\.\d+)*__.+\.sql$/.test(f));
  return files.map((filename) => {
    const m = filename.match(/^V(\d+(?:\.\d+)*)__(.+)\.sql$/);
    const version = m[1];
    const description = m[2].replace(/_/g, " ");
    return { version, filename, description, type: "SQL", tool: "flyway" };
  }).sort((a, b) => versionCompare(a.version, b.version));
}
function versionCompare(a, b) {
  const ax = a.split(".").map(Number);
  const bx = b.split(".").map(Number);
  const len = Math.max(ax.length, bx.length);
  for (let i = 0; i < len; i++) {
    const av = ax[i] ?? 0;
    const bv = bx[i] ?? 0;
    if (av !== bv) return av - bv;
  }
  return 0;
}
var FlywayAdapter = {
  id: "flyway",
  languages: ["java", "kotlin"],
  detect(projectDir) {
    return fs23.existsSync(path23.join(projectDir, "pom.xml"));
  },
  async apply(args) {
    const dsn = await buildDsn3(args);
    try {
      const legacy = await applyFlyway({ projectDir: args.projectDir, dsn });
      return {
        applied_migrations: legacy.applied,
        status: legacy.alreadyAtLatest ? "noop" : "ok",
        tool_specific: {
          alreadyAtLatest: legacy.alreadyAtLatest,
          tool: legacy.tool
        }
      };
    } catch (err) {
      return {
        applied_migrations: [],
        status: "error",
        error: err instanceof Error ? err.message : String(err)
      };
    }
  },
  // rollback intentionally absent: Flyway Community Edition does not
  // support it. Callers MUST property-check (`adapter.rollback?` /
  // `if (adapter.rollback)`) before invoking.
  async status(args) {
    const dsn = await buildDsn3(args);
    try {
      const legacy = await statusFlyway({ projectDir: args.projectDir, dsn });
      return {
        applied_version: legacy.current ?? null,
        pending: legacy.pending,
        // Legacy statusFlyway does not return the applied history; we
        // surface only the currently-applied version + pending. Adapters
        // that complete this (Alembic, future Knex) MAY populate.
        applied: [],
        status: "ok",
        tool_specific: { tool: legacy.tool }
      };
    } catch (err) {
      return {
        applied_version: null,
        pending: [],
        applied: [],
        status: "error",
        error: err instanceof Error ? err.message : String(err)
      };
    }
  },
  async list(args) {
    return { files: listFlywayFiles(args.projectDir) };
  },
  // baseline intentionally absent. Flyway DOES support baseline at the
  // tool level, but exposing it cleanly requires plumbing flags into the
  // existing runner. Deferred to a follow-up slice; the adapter's
  // optional-protocol shape makes this additive.
  async newMigration(args) {
    try {
      const dir = path23.join(args.projectDir, "src", "main", "resources", "db", "migration");
      fs23.mkdirSync(dir, { recursive: true });
      const version = migrationTimestamp();
      const slug = migrationSlug2(args.slug);
      const filename = `V${version}__${slug}.sql`;
      const full = path23.join(dir, filename);
      if (fs23.existsSync(full)) throw new Error(`${filename} already exists`);
      fs23.writeFileSync(
        full,
        `-- V${version}: ${args.slug}
-- Flyway migration (write your DDL/DML below).
`,
        "utf8"
      );
      return { status: "ok", version, filename, path: full };
    } catch (err) {
      return {
        status: "error",
        version: "",
        filename: "",
        path: "",
        error: err instanceof Error ? err.message : String(err)
      };
    }
  }
};
registerSchemaMigrationAdapter(FlywayAdapter);

// scripts/lakebase/adapters/knex-adapter.ts
init_esm_shims();
import * as fs25 from "fs";
import * as path25 from "path";

// scripts/lakebase/schema-migrate-runners/knex.ts
init_esm_shims();
import { spawn as spawn7 } from "child_process";
import * as fs24 from "fs";
import * as path24 from "path";
var KNEXFILE_VARIANTS = ["knexfile.js", "knexfile.ts", "knexfile.mjs", "knexfile.cjs"];
function findKnexfile(projectDir) {
  for (const name of KNEXFILE_VARIANTS) {
    const p = path24.join(projectDir, name);
    if (fs24.existsSync(p)) return p;
  }
  return void 0;
}
function spawnKnex(projectDir, args, dsn) {
  return new Promise((resolve2, reject) => {
    const knexfile = findKnexfile(projectDir);
    if (!knexfile) {
      reject(
        new SchemaMigrationError(
          `No knexfile found in ${projectDir}. Expected one of: ${KNEXFILE_VARIANTS.join(", ")}.`
        )
      );
      return;
    }
    const child = spawn7("npx", ["--no-install", "knex", "--knexfile", knexfile, ...args], {
      cwd: projectDir,
      env: dsn ? { ...process.env, DATABASE_URL: dsn } : { ...process.env },
      stdio: ["ignore", "pipe", "pipe"]
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString("utf8");
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString("utf8");
    });
    child.on("error", (err) => {
      reject(
        new SchemaMigrationError(
          `Could not spawn knex via npx. Is Node installed and is 'knex' in the project's node_modules? ${err.message}`,
          err
        )
      );
    });
    child.on("close", (code) => {
      if (code === 0) {
        resolve2({ stdout, stderr });
      } else {
        reject(
          new SchemaMigrationError(
            `knex ${args.join(" ")} exited with code ${code}.
stdout: ${stdout}
stderr: ${stderr}`
          )
        );
      }
    });
  });
}
function runKnex(ctx, args) {
  return spawnKnex(ctx.projectDir, args, ctx.dsn);
}
async function createKnexMigration(opts) {
  const { stdout } = await spawnKnex(opts.projectDir, ["migrate:make", opts.slug]);
  const m = stdout.match(/Created Migration:\s*(\S+)/);
  if (m) return m[1].trim();
  throw new SchemaMigrationError(
    `knex migrate:make succeeded but the created file could not be located.
stdout: ${stdout}`
  );
}
function parseKnexStatus(stdout) {
  const completed = [];
  const pending = [];
  let mode = null;
  for (const rawLine of stdout.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (/^Found\s+\d+\s+Completed\s+Migration/i.test(line)) {
      mode = "completed";
      continue;
    }
    if (/^Found\s+\d+\s+Pending\s+Migration/i.test(line)) {
      mode = "pending";
      continue;
    }
    if (/^No\s+Pending\s+Migration\s+files\s+Found/i.test(line)) {
      mode = null;
      continue;
    }
    if (!line) continue;
    if (!/\.(js|ts|mjs|cjs)$/.test(line)) continue;
    if (mode === "completed") completed.push(line);
    if (mode === "pending") pending.push(line);
  }
  return { completed, pending };
}
function parseKnexFilename(filename) {
  const stem = filename.replace(/\.(js|ts|mjs|cjs)$/, "");
  const m = stem.match(/^(\d{14})_(.+)$/);
  const version = m ? m[1] : stem;
  const description = m ? m[2].replace(/[_-]/g, " ") : stem;
  return { version, description };
}
async function applyKnex(ctx) {
  const beforeOut = await runKnex(ctx, ["migrate:status"]);
  const before = parseKnexStatus(beforeOut.stdout);
  await runKnex(ctx, ["migrate:latest"]);
  const afterOut = await runKnex(ctx, ["migrate:status"]);
  const after = parseKnexStatus(afterOut.stdout);
  const newlyCompleted = after.completed.filter((f) => !before.completed.includes(f));
  if (newlyCompleted.length === 0) {
    return { applied: [], alreadyAtLatest: true, tool: "knex" };
  }
  const applied = newlyCompleted.map((filename) => {
    const { version, description } = parseKnexFilename(filename);
    return { version, description };
  });
  return { applied, alreadyAtLatest: false, tool: "knex" };
}
async function rollbackKnex(ctx) {
  const beforeOut = await runKnex(ctx, ["migrate:status"]);
  const before = parseKnexStatus(beforeOut.stdout);
  const rollbackArgs = ["migrate:rollback"];
  if (ctx.target === "all" || ctx.target === "0") {
    rollbackArgs.push("--all");
  }
  await runKnex(ctx, rollbackArgs);
  const afterOut = await runKnex(ctx, ["migrate:status"]);
  const after = parseKnexStatus(afterOut.stdout);
  const rolledBackFiles = before.completed.filter((f) => !after.completed.includes(f));
  const rolledBack = rolledBackFiles.map((filename) => {
    const { version, description } = parseKnexFilename(filename);
    return { version, description };
  });
  return { rolledBack, tool: "knex" };
}
async function statusKnex(ctx) {
  const { stdout } = await runKnex(ctx, ["migrate:status"]);
  const { completed, pending } = parseKnexStatus(stdout);
  const current = completed.length > 0 ? parseKnexFilename(completed[completed.length - 1]).version : void 0;
  const pendingOut = pending.map((filename) => {
    const { version, description } = parseKnexFilename(filename);
    return { version, filename, description };
  });
  return { current, pending: pendingOut, tool: "knex" };
}

// scripts/lakebase/adapters/knex-adapter.ts
async function buildDsn4(args) {
  const result = await getConnection({
    output: "dsn",
    instance: args.instance,
    branch: args.branch,
    database: args.database,
    endpointName: args.endpointName
  });
  return result.url;
}
var KNEXFILE_VARIANTS2 = ["knexfile.js", "knexfile.ts", "knexfile.mjs", "knexfile.cjs"];
function listKnexFiles(projectDir) {
  const dir = path25.join(projectDir, "migrations");
  if (!fs25.existsSync(dir)) return [];
  const files = fs25.readdirSync(dir).filter((f) => (f.endsWith(".js") || f.endsWith(".ts")) && !f.startsWith("."));
  return files.map((filename) => {
    const stem = filename.replace(/\.(js|ts)$/, "");
    const m = stem.match(/^(\d{14})_(.+)$/);
    const version = m ? m[1] : stem;
    const description = m ? m[2].replace(/[_-]/g, " ") : stem;
    const type = filename.endsWith(".ts") ? "TypeScript" : "JavaScript";
    return { version, filename, description, type, tool: "knex" };
  }).sort((a, b) => a.version.localeCompare(b.version));
}
var KnexAdapter = {
  id: "knex",
  languages: ["nodejs"],
  /**
   * A knexfile at the project root is the canonical Knex marker. A bare
   * package.json with no knexfile means "Node.js project, but not Knex"
   * and should NOT auto-route here. Callers can still force-select via
   * project.yaml#migration_tool.
   */
  detect(projectDir) {
    return KNEXFILE_VARIANTS2.some((name) => fs25.existsSync(path25.join(projectDir, name)));
  },
  async apply(args) {
    const dsn = await buildDsn4(args);
    try {
      const legacy = await applyKnex({ projectDir: args.projectDir, dsn });
      return {
        applied_migrations: legacy.applied,
        status: legacy.alreadyAtLatest ? "noop" : "ok",
        tool_specific: {
          alreadyAtLatest: legacy.alreadyAtLatest,
          tool: legacy.tool
        }
      };
    } catch (err) {
      return {
        applied_migrations: [],
        status: "error",
        error: err instanceof Error ? err.message : String(err)
      };
    }
  },
  async rollback(args) {
    const dsn = await buildDsn4(args);
    try {
      const legacy = await rollbackKnex({
        projectDir: args.projectDir,
        dsn,
        target: args.target
      });
      return {
        rolled_back: legacy.rolledBack,
        status: legacy.rolledBack.length === 0 ? "noop" : "ok",
        tool_specific: { tool: legacy.tool }
      };
    } catch (err) {
      return {
        rolled_back: [],
        status: "error",
        error: err instanceof Error ? err.message : String(err)
      };
    }
  },
  async status(args) {
    const dsn = await buildDsn4(args);
    try {
      const legacy = await statusKnex({ projectDir: args.projectDir, dsn });
      return {
        applied_version: legacy.current ?? null,
        pending: legacy.pending,
        applied: [],
        status: "ok",
        tool_specific: { tool: legacy.tool }
      };
    } catch (err) {
      return {
        applied_version: null,
        pending: [],
        applied: [],
        status: "error",
        error: err instanceof Error ? err.message : String(err)
      };
    }
  },
  async list(args) {
    return { files: listKnexFiles(args.projectDir) };
  },
  // baseline intentionally absent. Knex has no native baseline concept;
  // omitting it advertises that correctly via the optional-capability
  // protocol so callers won't attempt the operation.
  async newMigration(args) {
    try {
      const created = await createKnexMigration({ projectDir: args.projectDir, slug: migrationSlug2(args.slug) });
      const stem = path25.basename(created).replace(/\.(js|ts)$/, "");
      const version = stem.match(/^(\d{14})_/)?.[1] ?? stem;
      return { status: "ok", version, filename: path25.basename(created), path: created };
    } catch (err) {
      return {
        status: "error",
        version: "",
        filename: "",
        path: "",
        error: err instanceof Error ? err.message : String(err)
      };
    }
  }
};
registerSchemaMigrationAdapter(KnexAdapter);

// scripts/lakebase/schema-migrate.ts
var SchemaMigrationError = class extends Error {
  constructor(message, cause) {
    super(message);
    this.cause = cause;
    this.name = "SchemaMigrationError";
  }
  cause;
};
function detectLanguage(projectDir) {
  const lang = resolveMigrationLanguage(projectDir);
  if (lang === "unknown") {
    throw new SchemaMigrationError(
      `Could not detect project language in ${projectDir}. Expected one of: pom.xml (java/kotlin), pyproject.toml or alembic.ini (python), package.json (nodejs). Pass {language} explicitly to override.`
    );
  }
  return lang;
}
function toolForLanguage(language) {
  switch (language) {
    case "java":
    case "kotlin":
      return "flyway";
    case "python":
      return "alembic";
    case "nodejs":
      return "knex";
  }
}
function listSchemaMigrations(args = {}) {
  const projectDir = args.projectDir ?? process.cwd();
  const language = args.language ?? detectLanguage(projectDir);
  const tool = toolForLanguage(language);
  switch (tool) {
    case "flyway":
      return listFlywayMigrations(projectDir);
    case "alembic":
      return listAlembicMigrations(projectDir);
    case "knex":
      return listKnexMigrations(projectDir);
  }
}
function listFlywayMigrations(projectDir) {
  const dir = path26.join(projectDir, "src", "main", "resources", "db", "migration");
  if (!fs26.existsSync(dir)) return [];
  const files = fs26.readdirSync(dir).filter((f) => /^V\d+(\.\d+)*__.+\.sql$/.test(f));
  return files.map((filename) => {
    const m = filename.match(/^V(\d+(?:\.\d+)*)__(.+)\.sql$/);
    const version = m[1];
    const description = m[2].replace(/_/g, " ");
    return { version, filename, description, type: "SQL", tool: "flyway" };
  }).sort((a, b) => versionCompare2(a.version, b.version));
}
function listAlembicMigrations(projectDir) {
  const candidates = [
    path26.join(projectDir, "migrations", "versions"),
    path26.join(projectDir, "alembic", "versions")
  ];
  const dir = candidates.find((p) => fs26.existsSync(p));
  if (!dir) return [];
  const files = fs26.readdirSync(dir).filter((f) => f.endsWith(".py") && !f.startsWith("__"));
  return files.map((filename) => {
    const stem = filename.replace(/\.py$/, "");
    const sep4 = stem.indexOf("_");
    const version = sep4 === -1 ? stem : stem.slice(0, sep4);
    const description = sep4 === -1 ? "" : stem.slice(sep4 + 1).replace(/_/g, " ");
    return { version, filename, description, type: "Python", tool: "alembic" };
  }).sort((a, b) => a.filename.localeCompare(b.filename));
}
function listKnexMigrations(projectDir) {
  const dir = path26.join(projectDir, "migrations");
  if (!fs26.existsSync(dir)) return [];
  const files = fs26.readdirSync(dir).filter((f) => (f.endsWith(".js") || f.endsWith(".ts")) && !f.startsWith("."));
  return files.map((filename) => {
    const stem = filename.replace(/\.(js|ts)$/, "");
    const m = stem.match(/^(\d{14})_(.+)$/);
    const version = m ? m[1] : stem;
    const description = m ? m[2].replace(/[_-]/g, " ") : stem;
    const type = filename.endsWith(".ts") ? "TypeScript" : "JavaScript";
    return { version, filename, description, type, tool: "knex" };
  }).sort((a, b) => a.version.localeCompare(b.version));
}
function versionCompare2(a, b) {
  const ax = a.split(".").map(Number);
  const bx = b.split(".").map(Number);
  const len = Math.max(ax.length, bx.length);
  for (let i = 0; i < len; i++) {
    const av = ax[i] ?? 0;
    const bv = bx[i] ?? 0;
    if (av !== bv) return av - bv;
  }
  return 0;
}
function adapterFor(projectDir, language) {
  const override = language ? toolForLanguage(language) : void 0;
  return resolveSchemaMigrationAdapter(projectDir, override);
}
var TierMigrationRefusedError = class extends Error {
  constructor(branch) {
    super(
      `Refusing to run schema migrations against protected tier branch "${branch}". A feature build/experiment migrates only its OWN paired branch (or an ephemeral verify branch), never a shared tier (main/master/staging/dev or a configured tier). If this is the promote step intentionally migrating the parent tier, pass allowTier: true.`
    );
    this.branch = branch;
    this.name = "TierMigrationRefusedError";
  }
  branch;
};
function assertMigrationBranchAllowed(branch, opts, env = process.env) {
  if (opts.allowTier) return;
  if (protectedTierNamesFromEnv(env).has(normalizeTierName(branch))) {
    throw new TierMigrationRefusedError(branch);
  }
}
function dbRevisionOrphaned(appliedRevision, localRevisionIds) {
  const applied = (appliedRevision ?? "").trim();
  if (!applied) return false;
  return !localRevisionIds.includes(applied);
}
function parseAlembicMissingRevision(stderr) {
  const m = /[Cc]an't locate revision identified by ['"]?([0-9a-f]+)['"]?/.exec(stderr);
  return m ? m[1] : null;
}
async function applySchemaMigrations(args) {
  assertMigrationBranchAllowed(args.branch, { allowTier: args.allowTier });
  const projectDir = args.projectDir ?? process.cwd();
  const adapter = adapterFor(projectDir, args.language);
  const r = await adapter.apply({
    instance: args.instance,
    branch: args.branch,
    projectDir,
    database: args.database,
    endpointName: args.endpointName
  });
  if (r.status === "error") {
    throw new SchemaMigrationError(r.error ?? "apply failed");
  }
  return {
    applied: r.applied_migrations,
    alreadyAtLatest: r.status === "noop",
    tool: adapter.id
  };
}
async function rollbackSchemaMigration(args) {
  const projectDir = args.projectDir ?? process.cwd();
  const adapter = adapterFor(projectDir, args.language);
  if (!adapter.rollback) {
    throw new SchemaMigrationError(
      `Adapter '${adapter.id}' does not support rollback. (Flyway Community Edition has no \`undo\`; other adapters may omit rollback by design.)`
    );
  }
  const r = await adapter.rollback({
    instance: args.instance,
    branch: args.branch,
    projectDir,
    target: args.target,
    database: args.database,
    endpointName: args.endpointName
  });
  if (r.status === "error") {
    throw new SchemaMigrationError(r.error ?? "rollback failed");
  }
  return {
    rolledBack: r.rolled_back,
    tool: adapter.id
  };
}
async function schemaMigrationStatus(args) {
  const projectDir = args.projectDir ?? process.cwd();
  const adapter = adapterFor(projectDir, args.language);
  const r = await adapter.status({
    instance: args.instance,
    branch: args.branch,
    projectDir,
    database: args.database,
    endpointName: args.endpointName
  });
  if (r.status === "error") {
    throw new SchemaMigrationError(r.error ?? "status failed");
  }
  return {
    current: r.applied_version ?? void 0,
    pending: r.pending,
    tool: adapter.id
  };
}
function migrationTimestamp(now = /* @__PURE__ */ new Date()) {
  const p = (n) => String(n).padStart(2, "0");
  return `${now.getUTCFullYear()}${p(now.getUTCMonth() + 1)}${p(now.getUTCDate())}${p(now.getUTCHours())}${p(now.getUTCMinutes())}${p(now.getUTCSeconds())}`;
}
function migrationSlug2(description) {
  return description.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "migration";
}
async function collapseMigrationHeads(args) {
  const projectDir = args.projectDir ?? process.cwd();
  const adapter = adapterFor(projectDir, args.language);
  if (!adapter.collapseHeads) {
    return { status: "noop", headsBefore: [] };
  }
  const r = await adapter.collapseHeads({ projectDir, message: args.message, dryRun: args.dryRun });
  if (r.status === "error") {
    throw new SchemaMigrationError(r.error ?? "collapse heads failed");
  }
  return r;
}

// scripts/lakebase/infra-runner.ts
async function runInfraSuite(args) {
  const start = Date.now();
  const checks = [];
  checks.push(await runCheck("migrations-clean", async () => {
    const status = await schemaMigrationStatus({
      instance: args.instance,
      branch: args.branch,
      projectDir: args.projectDir
    });
    if (status.pending.length === 0) {
      return `no pending migrations (current=${status.current ?? "<none>"}, tool=${status.tool})`;
    }
    throw new Error(
      `${status.pending.length} pending migration(s): ` + status.pending.map((p) => p.version).slice(0, 5).join(", ") + (status.pending.length > 5 ? ", ..." : "")
    );
  }));
  checks.push(await runCheck("schema-diff-computable", async () => {
    const diff = await getSchemaDiff({
      instance: args.instance,
      branch: args.branch,
      comparisonBranch: args.comparisonBranch
    });
    return `diff computed against "${diff.comparisonBranchName || "<self>"}": +${diff.created.length} ~${diff.modified.length} -${diff.removed.length} tables`;
  }));
  checks.push(await runCheck("connection-reachable", async () => {
    const dsn = await getConnection({
      instance: args.instance,
      branch: args.branch,
      output: "dsn"
    });
    if (!dsn.url.startsWith("postgresql://")) {
      throw new Error(`getConnection returned non-DSN url: ${dsn.url.slice(0, 80)}`);
    }
    return `credential mint returned a DSN against ${dsn.host}:${dsn.port}/${dsn.database}`;
  }));
  const result = {
    passed: checks.every((c) => c.passed),
    checks,
    branch: args.branch,
    duration_ms: Date.now() - start
  };
  if (args.junitOutput) {
    fs27.mkdirSync(path27.dirname(args.junitOutput), { recursive: true });
    fs27.writeFileSync(args.junitOutput, formatJUnit(result), "utf8");
  }
  return result;
}
async function runCheck(name, body) {
  const start = Date.now();
  try {
    const detail = await body();
    return { name, passed: true, detail, duration_ms: Date.now() - start };
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    return { name, passed: false, detail, duration_ms: Date.now() - start };
  }
}
function formatJUnit(result) {
  const failures = result.checks.filter((c) => !c.passed).length;
  const totalSeconds = (result.duration_ms / 1e3).toFixed(3);
  const suiteName = "lakebase-infra";
  const cases = result.checks.map((c) => {
    const seconds = (c.duration_ms / 1e3).toFixed(3);
    const detail = escapeXml(c.detail);
    if (c.passed) {
      return `    <testcase classname="${suiteName}" name="${c.name}" time="${seconds}"/>`;
    }
    return [
      `    <testcase classname="${suiteName}" name="${c.name}" time="${seconds}">`,
      `      <failure message="${detail}"/>`,
      `    </testcase>`
    ].join("\n");
  });
  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<testsuites name="${suiteName}" tests="${result.checks.length}" failures="${failures}" time="${totalSeconds}">`,
    `  <testsuite name="${suiteName}" tests="${result.checks.length}" failures="${failures}" time="${totalSeconds}">`,
    ...cases,
    `  </testsuite>`,
    `</testsuites>`,
    ``
  ].join("\n");
}
function escapeXml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

// scripts/lakebase/scm-claim-feature.ts
init_esm_shims();
import * as fs28 from "fs";
import * as path28 from "path";
var ScmClaimError = class extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
    this.name = "ScmClaimError";
  }
  code;
};
var STATES_ALLOWING_CLAIM = [
  "scaffold-complete",
  "merged"
];
var IN_FLIGHT_CLAIMED_STATES = [
  "feature-claimed",
  "pr-ready",
  "ci-green"
];
async function resolveParentBranch(tierTopology, instance) {
  switch (tierTopology) {
    case 1: {
      const def = await getDefaultBranchId({ projectId: instance });
      if (!def) {
        throw new ScmClaimError(
          `Tier-1 project ${instance} has no default Lakebase branch. Has it been scaffolded?`,
          "missing-instance"
        );
      }
      return def;
    }
    case 2:
      return "staging";
    case 3:
      return "dev";
  }
}
function sanitizeFeatureSlug(featureId) {
  const trimmed = featureId.trim();
  if (trimmed.length === 0) {
    throw new ScmClaimError("feature-id is empty", "invalid-feature-id");
  }
  const sanitized = sanitizeBranchName(trimmed);
  if (!/[a-z0-9]/.test(sanitized)) {
    throw new ScmClaimError(
      `feature-id ${JSON.stringify(featureId)} contains no letters/digits; choose an identifier with at least one alphanumeric.`,
      "invalid-feature-id"
    );
  }
  return sanitized;
}
function featureBranchName(slug) {
  return sanitizeBranchName(`feature/${slug}`);
}
async function claimFeatureBranch(args) {
  const current = readWorkflowState(args.projectDir);
  if (!current) {
    throw new ScmClaimError(
      `No SCM workflow state found at ${path28.join(args.projectDir, ".lakebase/workflow-state.json")}. Run lakebase-create-project to scaffold, or re-seed via the substrate.`,
      "no-state-file"
    );
  }
  const slug = sanitizeFeatureSlug(args.featureId);
  const branch = featureBranchName(slug);
  const idempotent = args.idempotent !== false;
  if (IN_FLIGHT_CLAIMED_STATES.includes(current.state)) {
    if (idempotent && current.branch === branch) {
      return {
        state: current,
        paired: alreadyClaimedSentinel(current),
        alreadyClaimed: true
      };
    }
    throw new ScmClaimError(
      `Cannot claim ${branch}: workflow is already at "${current.state}" for "${current.feature_id ?? current.branch}". Finish it, or abandon it with lakebase-scm-abandon-feature.`,
      "already-claimed-other"
    );
  }
  if (!STATES_ALLOWING_CLAIM.includes(current.state)) {
    throw new ScmClaimError(
      `Cannot claim feature branch from state "${current.state}". Allowed predecessor states: ${STATES_ALLOWING_CLAIM.join(", ")}.`,
      "bad-precondition"
    );
  }
  const instance = args.instance ?? current.project_id;
  if (!instance) {
    throw new ScmClaimError(
      `LAKEBASE_PROJECT_ID is missing. Pass --instance or set it in .env.`,
      "missing-instance"
    );
  }
  const parentBranch = args.parentBranchOverride ?? await resolveParentBranch(current.tier_topology, instance);
  let paired = await createFeaturePairedBranch({
    instance,
    branch,
    parentBranch,
    cwd: args.projectDir
  });
  if (args.checkBranchDbAheadOfCode) {
    const orphanRev = await args.checkBranchDbAheadOfCode({
      instance,
      branch: paired.gitBranch,
      projectDir: args.projectDir
    });
    if (orphanRev) {
      if (args.resetStaleBranch) {
        await args.resetStaleBranch({ instance, branch: paired.gitBranch, projectDir: args.projectDir });
        paired = await createFeaturePairedBranch({ instance, branch, parentBranch, cwd: args.projectDir });
      } else {
        throw new ScmClaimError(
          `Cannot claim ${branch}: the paired Lakebase branch DB is AHEAD of code , applied revision '${orphanRev}' has no local migration file. This is a reused branch polluted by an earlier aborted build (its migration was git-reset away but the DB was not). Reset it with 'lakebase-scm-claim-feature-branch ${args.featureId} --reset-stale-branch' (drops the polluted branch + re-forks clean from the tier), or if the feature is already claimed run 'lakebase-scm-doctor --fix db-ahead-of-code'.`,
          "db-ahead-of-code"
        );
      }
    }
  }
  const now = (args.now ?? (() => /* @__PURE__ */ new Date()))();
  const next = {
    ...current,
    state: "feature-claimed",
    // Record the canonical feature id (case preserved, e.g. "F1-initial-domain")
    // so it matches the .tdd/features/<F> dir + downstream expectations. The
    // lowercased branch slug lives on `branch`, derived separately.
    feature_id: args.featureId.trim(),
    branch: paired.gitBranch,
    parent_branch: parentBranch,
    lakebase_branch_uid: paired.branch.uid,
    claimed_at: now.toISOString(),
    // Reset any later-state fields a previous merged cycle may have
    // left around. Keeping them would mark the new claim as past
    // pr-ready / ci-green which is not the case.
    pr_url: void 0,
    pushed_at: void 0,
    ci_run_url: void 0,
    ci_green_at: void 0,
    merged_at: void 0
  };
  writeWorkflowState(args.projectDir, next);
  return { state: next, paired, alreadyClaimed: false };
}
function alreadyClaimedSentinel(state) {
  return {
    branch: {
      // Reconstructed from the persisted state. Fields the CLI prints
      // (uid, name) are accurate; runtime-only fields (state) are
      // intentionally absent so a caller that diffs against a fresh
      // create cannot mistake this for a live branch.
      uid: state.lakebase_branch_uid,
      // Use the on-disk branch name so this looks legitimate to any
      // logger that just stringifies the result.
      name: state.branch ?? ""
      // Best-effort: leave optional fields blank; they're omitted from
      // the type's required surface so a stripped sentinel still
      // satisfies the structural contract.
    },
    gitBranch: state.branch ?? "",
    gitBranchCreated: false,
    envSynced: false,
    warnings: []
  };
}
function workflowStateFileExists(projectDir) {
  return fs28.existsSync(
    path28.join(projectDir, ".lakebase/workflow-state.json")
  );
}

// scripts/lakebase/scm-adopt-state.ts
init_esm_shims();
var ScmAdoptError = class extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
    this.name = "ScmAdoptError";
  }
  code;
};
function inferTierTopology(branches) {
  const names = new Set(
    branches.map((b) => b.name.split("/").pop() ?? "")
  );
  if (names.has("dev") && names.has("staging")) return 3;
  if (names.has("staging")) return 2;
  return 1;
}
function parentForTier(topology, branches) {
  if (topology === 3) return "dev";
  if (topology === 2) return "staging";
  const def = branches.find((b) => b.isDefault === true);
  return def?.name.split("/").pop() ?? "main";
}
var LONG_RUNNING_LEAFS = protectedTierNamesFromEnv();
function leafName(b) {
  return b.name.split("/").pop() ?? b.name;
}
async function adoptScmState(args) {
  if (!args.instance) {
    throw new ScmAdoptError(
      "Lakebase project id required (pass --instance or set LAKEBASE_PROJECT_ID in .env).",
      "missing-instance"
    );
  }
  const existing = readWorkflowState(args.projectDir);
  if (existing && !args.force) {
    throw new ScmAdoptError(
      `Workflow state already present at .lakebase/workflow-state.json (state: ${existing.state}). Pass --force to overwrite.`,
      "already-adopted"
    );
  }
  const notes = [];
  const currentBranch = await getCurrentBranch({ cwd: args.projectDir });
  if (!currentBranch) {
    throw new ScmAdoptError(
      "Could not resolve current git branch (detached HEAD?).",
      "missing-current-branch"
    );
  }
  const branches = await listBranches({ instance: args.instance });
  const topology = inferTierTopology(branches);
  notes.push(`Inferred tier_topology=${topology} from Lakebase branches.`);
  const defaultBranch = branches.find((b) => b.isDefault === true);
  const defaultLeaf = defaultBranch ? leafName(defaultBranch) : null;
  const isLongRunningTier = LONG_RUNNING_LEAFS.has(currentBranch) || defaultLeaf !== null && currentBranch === defaultLeaf;
  const base = initWorkflowState({
    projectId: args.instance,
    tierTopology: topology
  });
  if (isLongRunningTier) {
    notes.push(
      `Current git branch "${currentBranch}" is a long-running tier (default / staging / dev). Adopted state: scaffold-complete.`
    );
    writeWorkflowState(args.projectDir, base);
    return { state: base, notes };
  }
  if (!currentBranch.startsWith("feature/")) {
    throw new ScmAdoptError(
      `Current git branch "${currentBranch}" is not a long-running tier or a feature/<slug> branch. The adopter cannot guess the workflow state; switch to the tier you want to seed from, or rename the working branch.`,
      "unrecognized-branch"
    );
  }
  const sanitizedLeaf = currentBranch.replace(/\//g, "-");
  let pair;
  try {
    pair = await getBranchByName(sanitizedLeaf, { instance: args.instance });
  } catch {
    pair = void 0;
  }
  if (!pair) {
    throw new ScmAdoptError(
      `Git branch "${currentBranch}" has no matching Lakebase branch "${sanitizedLeaf}". The orphan must be paired (claim) or deleted before adoption.`,
      "lakebase-pair-missing"
    );
  }
  const now = (args.now ?? (() => /* @__PURE__ */ new Date()))();
  const featureSlug = currentBranch.slice("feature/".length);
  const adopted = {
    ...base,
    state: "feature-claimed",
    feature_id: featureSlug,
    branch: currentBranch,
    parent_branch: parentForTier(topology, branches),
    lakebase_branch_uid: pair.uid,
    claimed_at: now.toISOString()
  };
  writeWorkflowState(args.projectDir, adopted);
  notes.push(
    `Current branch "${currentBranch}" recognized as feature-claimed. Real claim time is unknown; recorded ${adopted.claimed_at} as adoption time.`
  );
  return { state: adopted, notes };
}

// scripts/lakebase/scm-abandon-feature.ts
init_esm_shims();
var ScmAbandonError = class extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
    this.name = "ScmAbandonError";
  }
  code;
};
async function abandonFeatureBranch(args) {
  const current = readWorkflowState(args.projectDir);
  if (!current) {
    throw new ScmAbandonError(
      `No SCM workflow state found at ${args.projectDir}/.lakebase/workflow-state.json.`,
      "no-state-file"
    );
  }
  if (current.state !== "feature-claimed") {
    throw new ScmAbandonError(
      `abandon refuses state "${current.state}". Only feature-claimed is abandonable; later states must complete or be reverted via gh.`,
      "bad-precondition"
    );
  }
  if (!current.feature_id || !current.branch || !current.parent_branch || !current.lakebase_branch_uid) {
    throw new ScmAbandonError(
      "feature-claimed row is missing required invariants. Cannot abandon safely; consider re-adopting state first.",
      "missing-claim-fields"
    );
  }
  if (!args.force) {
    const dirty = await isDirty({ cwd: args.projectDir });
    if (dirty) {
      throw new ScmAbandonError(
        "Working tree has uncommitted changes; refusing to abandon (the branch delete would lose them). Commit / stash / discard first, or pass --force.",
        "dirty-working-tree"
      );
    }
  }
  const instance = args.instance ?? current.project_id;
  const switchTo = args.switchTo ?? current.parent_branch;
  const warnings = [];
  const headBranch = await getCurrentBranch({ cwd: args.projectDir });
  if (headBranch === current.branch) {
    try {
      await exec2(`git checkout ${JSON.stringify(switchTo)}`, {
        cwd: args.projectDir,
        timeout: 1e4
      });
    } catch (err) {
      warnings.push(
        `git checkout ${switchTo} failed: ${err instanceof Error ? err.message : String(err)}. Local branch delete may be skipped.`
      );
    }
  }
  const del = await deletePairedBranch({
    instance,
    branch: current.branch,
    cwd: args.projectDir
  });
  warnings.push(...del.warnings);
  const reset = {
    $schema: current.$schema,
    version: 1,
    state: "scaffold-complete",
    tier_topology: current.tier_topology,
    project_id: current.project_id
  };
  writeWorkflowState(args.projectDir, reset);
  return {
    state: reset,
    lakebaseDeleted: del.lakebaseDeleted,
    gitLocalDeleted: del.gitLocalDeleted,
    gitRemoteDeleted: del.gitRemoteDeleted,
    warnings
  };
}

// scripts/lakebase/scm-prepare-pr.ts
init_esm_shims();

// scripts/lakebase/scm-git-base.ts
init_esm_shims();
async function resolveGitBase(parentBranch, cwd) {
  if (parentBranch && await gitBranchExists({ cwd, branch: parentBranch })) {
    return parentBranch;
  }
  return resolveDefaultBranch({ cwd });
}

// scripts/lakebase/scm-prepare-pr.ts
var ScmPreparePrError = class extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
    this.name = "ScmPreparePrError";
  }
  code;
};
async function preparePr(args) {
  const current = readWorkflowState(args.projectDir);
  if (!current) {
    throw new ScmPreparePrError(
      `No SCM workflow state at ${args.projectDir}/.lakebase/workflow-state.json. Claim a feature first.`,
      "no-state-file"
    );
  }
  if (current.state !== "feature-claimed") {
    throw new ScmPreparePrError(
      `prepare-pr refuses state "${current.state}". Allowed predecessor: feature-claimed.`,
      "bad-precondition"
    );
  }
  if (!current.branch || !current.parent_branch || !current.feature_id) {
    throw new ScmPreparePrError(
      "feature-claimed row missing branch / parent_branch / feature_id; refusing to push.",
      "bad-precondition"
    );
  }
  const headBranch = await getCurrentBranch({ cwd: args.projectDir });
  if (headBranch !== current.branch) {
    throw new ScmPreparePrError(
      `HEAD is on "${headBranch}" but workflow state says "${current.branch}". Checkout the feature branch first.`,
      "wrong-branch"
    );
  }
  if (!args.force) {
    const dirty = await isDirty({ cwd: args.projectDir, ignore: [...RUNTIME_ARTIFACT_IGNORE] });
    if (dirty) {
      throw new ScmPreparePrError(
        "Working tree has uncommitted code changes; commit them before opening the PR (or pass --force).",
        "dirty-working-tree"
      );
    }
  }
  const gitBase = await resolveGitBase(current.parent_branch, args.projectDir);
  if (!args.allowNoCommits) {
    const ahead = await ensureAheadOfParent(
      args.projectDir,
      current.branch,
      gitBase
    );
    if (ahead === 0) {
      throw new ScmPreparePrError(
        `Branch "${current.branch}" has 0 commits ahead of "${gitBase}". Make at least one commit (or pass --allow-no-commits).`,
        "no-commits-ahead"
      );
    }
  }
  const ownerRepo = await getOwnerRepo(args.projectDir);
  if (!ownerRepo) {
    throw new ScmPreparePrError(
      "No GitHub remote found at origin (or origin is not a github.com URL). Add one before running prepare-pr.",
      "no-github-remote"
    );
  }
  const now = (args.now ?? (() => /* @__PURE__ */ new Date()))();
  let prUrl = args.prUrlOverride ?? "";
  let prCreated = false;
  if (!prUrl) {
    try {
      await exec2(
        `git push -u ${shellEscape(args.remote ?? "origin")} ${shellEscape(current.branch)}`,
        { cwd: args.projectDir, timeout: 6e4 }
      );
    } catch (err) {
      const raw = err instanceof Error ? err.message : String(err);
      throw new ScmPreparePrError(
        `git push failed: ${raw}${pushFailureHint(raw)}`,
        "push-failed"
      );
    }
    const existing = await getPullRequest(ownerRepo, current.branch);
    if (existing) {
      prUrl = existing.url;
    } else {
      try {
        prUrl = await createPullRequest({
          ownerRepo,
          headBranch: current.branch,
          baseBranch: gitBase,
          title: args.title ?? `feat: ${current.feature_id}`,
          body: args.body ?? defaultBody(current.feature_id, gitBase)
        });
        prCreated = true;
      } catch (err) {
        throw new ScmPreparePrError(
          `Failed to create pull request: ${err instanceof Error ? err.message : String(err)}`,
          "pr-failed"
        );
      }
    }
  }
  const next = {
    ...current,
    state: "pr-ready",
    pr_url: prUrl,
    pushed_at: now.toISOString()
  };
  writeWorkflowState(args.projectDir, next);
  return { state: next, prUrl, prCreated };
}
async function ensureAheadOfParent(cwd, branch, parent) {
  try {
    const out = (await exec2(
      `git rev-list --count ${shellEscape(`${parent}..${branch}`)}`,
      { cwd, timeout: 1e4 }
    )).trim();
    return Number.parseInt(out, 10) || 0;
  } catch {
    try {
      const out = (await exec2(
        `git rev-list --count ${shellEscape(`origin/${parent}..${branch}`)}`,
        { cwd, timeout: 1e4 }
      )).trim();
      return Number.parseInt(out, 10) || 0;
    } catch {
      const ab = await getAheadBehind({ cwd });
      return ab.ahead;
    }
  }
}
function pushFailureHint(rawMessage) {
  const looksLikeAccess = /repository not found|not found|\b403\b|\b401\b|permission denied|access denied|could not read (?:username|password)|authentication failed|fatal: could not read/i.test(
    rawMessage
  );
  if (!looksLikeAccess) return "";
  return [
    "",
    "",
    "  The remote rejected the push. For a PRIVATE repo this usually means git",
    "  authenticated as a GitHub account WITHOUT access - GitHub returns",
    '  "Repository not found" rather than a permission error, so it looks like a',
    "  wrong URL when it is really the wrong account. Check `gh auth status`; if",
    "  the repo lives under an org only one of your accounts can see, make that",
    "  account active (`gh auth switch --user <account>`) or fix the `origin`",
    "  remote, then re-run prepare-pr."
  ].join("\n");
}
function defaultBody(featureId, baseBranch) {
  return [
    `Feature: \`${featureId}\``,
    "",
    `Forks from \`${baseBranch}\`.`,
    "",
    "PR opened by `lakebase-scm-prepare-pr` (phase B+)."
  ].join("\n");
}
function shellEscape(s) {
  return `'${s.replace(/'/g, "'\\''")}'`;
}

// scripts/lakebase/scm-wait-ci.ts
init_esm_shims();
var ScmWaitCiError = class extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
    this.name = "ScmWaitCiError";
  }
  code;
};
var DEFAULT_TIMEOUT_MS2 = 30 * 60 * 1e3;
var DEFAULT_POLL_MS = 30 * 1e3;
async function waitForCi(args) {
  const current = readWorkflowState(args.projectDir);
  if (!current) {
    throw new ScmWaitCiError(
      "No SCM workflow state. Claim + prepare-pr first.",
      "no-state-file"
    );
  }
  if (current.state !== "pr-ready") {
    throw new ScmWaitCiError(
      `wait-ci refuses state "${current.state}". Allowed predecessor: pr-ready.`,
      "bad-precondition"
    );
  }
  if (!current.branch) {
    throw new ScmWaitCiError(
      "pr-ready row is missing branch; cannot resolve the PR.",
      "bad-precondition"
    );
  }
  const ownerRepo = await getOwnerRepo(args.projectDir);
  if (!ownerRepo) {
    throw new ScmWaitCiError(
      "No GitHub remote found at origin.",
      "no-github-remote"
    );
  }
  const timeoutMs = args.timeoutMs ?? DEFAULT_TIMEOUT_MS2;
  const pollMs = args.pollMs ?? DEFAULT_POLL_MS;
  const fetchPr = args.fetchPr ?? getPullRequest;
  const now = args.now ?? (() => /* @__PURE__ */ new Date());
  const headBranch = current.branch;
  let lastPr;
  const result = await pollUntil({
    timeoutMs,
    intervalMs: pollMs,
    now,
    sleep: args.sleep,
    probe: async () => {
      lastPr = await fetchPr(ownerRepo, headBranch);
      if (!lastPr) {
        throw new ScmWaitCiError(
          `No open PR found for head=${headBranch} on ${ownerRepo}. Did the PR get closed?`,
          "pr-not-found"
        );
      }
      if (lastPr.ciStatus === "success") {
        return { done: true, value: lastPr };
      }
      if (lastPr.ciStatus === "failure") {
        const failed = lastPr.checks.filter((c) => /(FAILURE|TIMED_OUT|CANCELLED|ACTION_REQUIRED)/i.test(c.conclusion)).map((c) => `${c.name} (${c.conclusion})`);
        throw new ScmWaitCiError(
          `CI failed for PR ${lastPr.url}. Failed checks: ${failed.join(", ") || "(unknown)"}.`,
          "ci-failed"
        );
      }
      return { done: false };
    }
  });
  if (result.outcome === "timeout") {
    throw new ScmWaitCiError(
      `Timed out after ${Math.round(timeoutMs / 1e3)}s waiting for CI on PR ${lastPr?.url ?? current.pr_url ?? "(unknown)"}. Last status: ${lastPr?.ciStatus ?? "(no poll completed)"}.`,
      "timeout"
    );
  }
  const greenPr = result.value;
  const runUrl = pickRunUrl(greenPr);
  const next = {
    ...current,
    state: "ci-green",
    ci_run_url: runUrl,
    ci_green_at: now().toISOString()
  };
  writeWorkflowState(args.projectDir, next);
  return { state: next, pr: greenPr, polls: result.polls };
}
function pickRunUrl(pr) {
  const withUrl = pr.checks.find((c) => c.detailsUrl);
  return withUrl?.detailsUrl ?? pr.url;
}

// scripts/lakebase/scm-merge.ts
init_esm_shims();
var ScmMergeError = class extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
    this.name = "ScmMergeError";
  }
  code;
};
var DEFAULT_MIGRATE_TIMEOUT_MS = 30 * 60 * 1e3;
var DEFAULT_MIGRATE_POLL_MS = 30 * 1e3;
function defaultMigratePredicate(run, mergedAt) {
  if (!run.createdAt) return false;
  const created = Date.parse(run.createdAt);
  if (!Number.isFinite(created)) return false;
  if (run.event && run.event !== "push") return false;
  return created >= mergedAt.getTime() - 5e3;
}
function shaMigratePredicate(mergeCommitSha) {
  return (run) => {
    if (run.event && run.event !== "push") return false;
    return !!run.headSha && run.headSha === mergeCommitSha;
  };
}
async function mergeFeature(args) {
  const current = readWorkflowState(args.projectDir);
  if (!current) {
    throw new ScmMergeError(
      "No SCM workflow state. wait-ci first.",
      "no-state-file"
    );
  }
  if (current.state !== "ci-green") {
    throw new ScmMergeError(
      `merge refuses state "${current.state}". Allowed predecessor: ci-green.`,
      "bad-precondition"
    );
  }
  if (!current.pr_url) {
    throw new ScmMergeError(
      "ci-green row is missing pr_url; cannot resolve the PR to merge.",
      "no-pr-url"
    );
  }
  if (!current.branch || !current.parent_branch) {
    throw new ScmMergeError(
      "ci-green row missing branch / parent_branch; refusing to merge.",
      "bad-precondition"
    );
  }
  const ownerRepo = await getOwnerRepo(args.projectDir);
  if (!ownerRepo) {
    throw new ScmMergeError(
      "No GitHub remote found at origin.",
      "no-github-remote"
    );
  }
  const pullNumber = extractPullNumber(current.pr_url);
  if (!pullNumber) {
    throw new ScmMergeError(
      `Could not extract PR number from URL: ${current.pr_url}`,
      "bad-pr-url"
    );
  }
  const instance = args.instance ?? current.project_id;
  const gitBase = await resolveGitBase(current.parent_branch, args.projectDir);
  const wantMigrate = args.waitMigrate !== false;
  let authVerified = false;
  if (wantMigrate && args.verifyMigrateAuth) {
    const probe = await args.verifyMigrateAuth();
    if (!probe.ok) {
      throw new ScmMergeError(
        `Migrate-auth precondition failed: ${probe.detail ?? "the Databricks credential is not usable"}. Refusing to merge: the downstream migrate would promote git without applying the schema. Refresh your credential (databricks auth login), then re-run.`,
        "migrate-auth"
      );
    }
    authVerified = true;
  }
  let paired;
  try {
    paired = await mergePairedPullRequest({
      ownerRepo,
      pullNumber,
      lakebaseInstance: instance,
      method: args.method ?? "squash"
    });
  } catch (err) {
    throw new ScmMergeError(
      `mergePairedPullRequest failed: ${err instanceof Error ? err.message : String(err)}`,
      "merge-failed"
    );
  }
  const warnings = [...paired.warnings];
  let localBranchDeleted = false;
  let headAfter = current.branch;
  if (!args.skipLocalCleanup) {
    const switchTo = args.switchTo ?? gitBase;
    const head = await getCurrentBranch({ cwd: args.projectDir });
    if (head === current.branch) {
      try {
        await exec2(`git checkout ${shellEscape2(switchTo)}`, {
          cwd: args.projectDir,
          timeout: 1e4
        });
        headAfter = switchTo;
        try {
          await exec2(`git fetch origin ${shellEscape2(switchTo)}`, {
            cwd: args.projectDir,
            timeout: 3e4
          });
          await exec2(`git merge --ff-only ${shellEscape2(`origin/${switchTo}`)}`, {
            cwd: args.projectDir,
            timeout: 1e4
          });
        } catch (err) {
          warnings.push(
            `local fast-forward of ${switchTo} to origin/${switchTo} failed: ${err instanceof Error ? err.message : String(err)}. The PR merged remotely; your local ${switchTo} may be stale, run \`git pull --ff-only\`.`
          );
        }
      } catch (err) {
        warnings.push(
          `git checkout ${switchTo} failed: ${err instanceof Error ? err.message : String(err)}. Local branch was NOT deleted.`
        );
      }
    } else {
      headAfter = head || current.branch;
    }
    if (headAfter !== current.branch) {
      try {
        await exec2(
          `git branch -D ${shellEscape2(current.branch)}`,
          { cwd: args.projectDir, timeout: 1e4 }
        );
        localBranchDeleted = true;
      } catch (err) {
        warnings.push(
          `git branch -D ${current.branch} failed: ${err instanceof Error ? err.message : String(err)}.`
        );
      }
    }
  }
  const nowFn = args.now ?? (() => /* @__PURE__ */ new Date());
  const mergedAt = nowFn();
  let next = {
    ...current,
    state: "merged",
    merged_at: mergedAt.toISOString()
  };
  writeWorkflowState(args.projectDir, next);
  let migrate;
  const waitMigrate = args.waitMigrate !== false;
  if (waitMigrate) {
    const timeoutMs = args.migrateTimeoutMs ?? DEFAULT_MIGRATE_TIMEOUT_MS;
    const pollMs = args.migratePollMs ?? DEFAULT_MIGRATE_POLL_MS;
    const fetchRuns = args.fetchRuns ?? listWorkflowRuns;
    const predicate = args.migrateRunPredicate ?? (paired.mergeCommitSha ? shaMigratePredicate(paired.mergeCommitSha) : defaultMigratePredicate);
    const elapsedSinceMerge = nowFn().getTime() - mergedAt.getTime();
    const remainingTimeoutMs = Math.max(0, timeoutMs - elapsedSinceMerge);
    let polls = 0;
    let matched;
    let lastSeen;
    try {
      const result = await pollUntil({
        timeoutMs: remainingTimeoutMs,
        intervalMs: pollMs,
        now: nowFn,
        sleep: args.sleep,
        probe: async () => {
          const runs = await fetchRuns(ownerRepo, 20);
          const candidates = runs.filter((r) => r.branch === gitBase).filter((r) => predicate(r, mergedAt));
          if (candidates.length === 0) {
            return { done: false };
          }
          candidates.sort(
            (a, b) => Date.parse(b.createdAt ?? "0") - Date.parse(a.createdAt ?? "0")
          );
          lastSeen = candidates[0];
          const status = (lastSeen.status ?? "").toLowerCase();
          return status === "completed" ? { done: true, value: lastSeen } : { done: false };
        }
      });
      polls = result.polls;
      if (result.outcome === "done") {
        matched = result.value;
      }
    } catch (err) {
      warnings.push(
        `Downstream migrate poll errored: ${err instanceof Error ? err.message : String(err)}. Treating as advisory.`
      );
    }
    const applyLocalFallback = async (reason) => {
      if (!args.localMigrateFallback) return false;
      const r = await args.localMigrateFallback();
      if (!r.ok) {
        warnings.push(
          `Local-migrate fallback FAILED after ${reason}: ${r.detail ?? "unknown error"}. git promoted but the parent schema is NOT applied (partial promotion); apply it manually.`
        );
        return false;
      }
      next = { ...next, migrate_completed_at: nowFn().toISOString() };
      writeWorkflowState(args.projectDir, next);
      migrate = { ...migrate ?? { waited: true, polls }, appliedLocally: true, authVerified };
      warnings.push(
        `Downstream migrate did not confirm (${reason}); applied the parent migrations LOCALLY instead. git and Lakebase schema are in sync${r.detail ? ` (${r.detail})` : ""}.`
      );
      return true;
    };
    if (matched) {
      const runUrl = workflowRunUrl(ownerRepo, matched);
      const conclusion = (matched.conclusion ?? "").toLowerCase();
      migrate = {
        waited: true,
        runUrl,
        conclusion,
        polls,
        authVerified
      };
      if (conclusion === "success") {
        next = {
          ...next,
          migrate_run_url: runUrl,
          migrate_completed_at: nowFn().toISOString()
        };
        writeWorkflowState(args.projectDir, next);
      } else {
        const applied = await applyLocalFallback(`the downstream migrate finished conclusion=${conclusion} (${runUrl})`);
        if (!applied) {
          throw new ScmMergeError(
            `Downstream migrate workflow finished with conclusion=${conclusion}. Run ${runUrl} for details.`,
            "migrate-failed"
          );
        }
      }
    } else {
      const budgetSec = Math.round(
        (args.migrateTimeoutMs ?? DEFAULT_MIGRATE_TIMEOUT_MS) / 1e3
      );
      const lastStatus = lastSeen?.status ?? "(no matching run)";
      const timeoutFatal = args.migrateTimeoutFatal !== false;
      if (timeoutFatal) {
        migrate = { waited: true, polls, authVerified };
        const applied = await applyLocalFallback(
          `the downstream migrate did not complete within ${budgetSec}s (last seen: ${lastStatus})`
        );
        if (!applied) {
          throw new ScmMergeError(
            `Timed out after ${budgetSec}s waiting for the downstream migrate workflow on "${gitBase}". Last seen status: ${lastStatus}.`,
            "migrate-timeout"
          );
        }
      } else {
        migrate = { waited: true, polls, timedOut: true, authVerified };
        warnings.push(
          `Downstream migrate workflow on "${gitBase}" was not confirmed within ${budgetSec}s (last seen status: ${lastStatus}). The PR merged and your local ${gitBase} is synced; the migrate run may still be pending or running. Confirm it later via the Actions tab or re-run with --wait-migrate.`
        );
      }
    }
  } else {
    migrate = { waited: false, polls: 0 };
  }
  return {
    state: next,
    paired,
    localBranchDeleted,
    headAfter,
    migrate,
    warnings
  };
}
function workflowRunUrl(ownerRepo, run) {
  return `https://github.com/${ownerRepo}/actions/runs/${run.id}`;
}
function extractPullNumber(prUrl) {
  const m = prUrl.match(/\/pull\/(\d+)(?:[\/?#].*)?$/);
  if (!m) return void 0;
  const n = Number.parseInt(m[1], 10);
  return Number.isFinite(n) ? n : void 0;
}
function shellEscape2(s) {
  return `'${s.replace(/'/g, "'\\''")}'`;
}

// scripts/lakebase/scm-recover-orphans.ts
init_esm_shims();

// scripts/git/branches.ts
init_esm_shims();
async function currentBranchName(cwd) {
  try {
    return await exec2("git rev-parse --abbrev-ref HEAD", { cwd });
  } catch {
    return "";
  }
}
async function listLocalBranches(args) {
  const { cwd } = args;
  let raw;
  try {
    raw = await exec2(
      'git branch --format="%(refname:short)|%(upstream:short)|%(upstream:track)"',
      { cwd }
    );
  } catch {
    return [];
  }
  if (!raw) return [];
  const current = await currentBranchName(cwd);
  return raw.split("\n").filter(Boolean).map((line) => {
    const [name, tracking, trackInfo] = line.split("|");
    let ahead = 0;
    let behind = 0;
    if (trackInfo) {
      const aheadMatch = trackInfo.match(/ahead (\d+)/);
      const behindMatch = trackInfo.match(/behind (\d+)/);
      if (aheadMatch) ahead = parseInt(aheadMatch[1], 10);
      if (behindMatch) behind = parseInt(behindMatch[1], 10);
    }
    return {
      name,
      isCurrent: name === current,
      isRemote: false,
      tracking: tracking || void 0,
      ahead,
      behind
    };
  });
}
async function listRemoteBranches(args) {
  const { cwd, remote = "origin" } = args;
  try {
    const localBranches = await listLocalBranches({ cwd });
    const localNames = new Set(localBranches.map((b) => b.name));
    const raw = await exec2(`git branch -r --format="%(refname:short)"`, {
      cwd
    });
    if (!raw) return [];
    const remotePrefix = `${remote}/`;
    return raw.split("\n").filter(Boolean).filter((name) => !name.includes("HEAD")).map((name) => {
      const shortName = name.startsWith(remotePrefix) ? name.slice(remotePrefix.length) : name;
      return { fullName: name, shortName };
    }).filter(({ shortName }) => !localNames.has(shortName)).map(({ fullName, shortName }) => ({
      name: shortName,
      isCurrent: false,
      isRemote: true,
      tracking: fullName
    }));
  } catch {
    return [];
  }
}
async function hasRemoteBranch(args) {
  const { cwd, branch, remote = "origin" } = args;
  try {
    const out = await exec2(
      `git ls-remote --heads "${remote}" "${branch}"`,
      { cwd }
    );
    return out.trim().length > 0;
  } catch {
    return false;
  }
}

// scripts/lakebase/scm-recover-orphans.ts
var ScmRecoverError = class extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
    this.name = "ScmRecoverError";
  }
  code;
};
var TIER_LEAFS = /* @__PURE__ */ new Set(["staging", "dev", "main", "master"]);
async function recoverOrphans(args) {
  if (!args.instance) {
    throw new ScmRecoverError(
      "Lakebase project id required (--instance / LAKEBASE_PROJECT_ID).",
      "missing-instance"
    );
  }
  const lakebaseBranches = await listBranches({ instance: args.instance });
  const tierTopology = inferTierTopology(lakebaseBranches);
  const lakebaseLeafs = new Set(
    lakebaseBranches.map((b) => leafName2(b))
  );
  const defaultLeaf = leafName2(
    lakebaseBranches.find((b) => b.isDefault === true)
  );
  const gitBranches = await listLocalBranches({ cwd: args.projectDir });
  const orphans = [];
  const skipped = [];
  for (const gb of gitBranches) {
    if (gb.isRemote) continue;
    const name = gb.name;
    if (TIER_LEAFS.has(name)) {
      skipped.push({ gitBranch: name, reason: "tier branch" });
      continue;
    }
    if (defaultLeaf && name === defaultLeaf) {
      skipped.push({ gitBranch: name, reason: "default branch" });
      continue;
    }
    const sanitized = sanitizeBranchName(name);
    if (lakebaseLeafs.has(sanitized)) {
      skipped.push({
        gitBranch: name,
        reason: `paired Lakebase branch "${sanitized}" exists`
      });
      continue;
    }
    orphans.push({
      gitBranch: name,
      sanitized,
      isCurrent: gb.isCurrent === true,
      reason: name.startsWith("feature/") ? "feature/<slug> branch with no Lakebase pair" : `non-tier git branch "${name}" with no Lakebase pair`
    });
  }
  const result = {
    tierTopology,
    orphans,
    skipped,
    claimed: []
  };
  if (!args.claim || orphans.length === 0) {
    return result;
  }
  const parentBranch = parentForTopology(tierTopology, defaultLeaf);
  const currentState = readWorkflowState(args.projectDir);
  const candidates = args.onlyBranch ? orphans.filter((o) => o.gitBranch === args.onlyBranch) : orphans;
  if (args.onlyBranch && candidates.length === 0) {
    throw new ScmRecoverError(
      `No orphan found for --only-branch ${args.onlyBranch}.`,
      "claim-conflict"
    );
  }
  const headOrphan = candidates.find((o) => o.isCurrent);
  const stateTargetOrphan = headOrphan ?? candidates[0];
  for (const orphan of candidates) {
    try {
      const paired = await createFeaturePairedBranch({
        instance: args.instance,
        branch: orphan.gitBranch,
        parentBranch,
        cwd: args.projectDir
        // The git branch already exists on disk; the substrate primitive
        // is idempotent on the git side (it'll checkout the existing
        // branch rather than fail) but if the project is not on this
        // branch, we want a no-op git side. Leaving the default true is
        // OK: if the git branch already matches, the checkout is a
        // no-op; if the branch isn't HEAD, the substrate switches to it
        // which is what the user implicitly asked for by including the
        // branch.
      });
      let stateUpdated = false;
      if (orphan === stateTargetOrphan) {
        const next = {
          ...currentState ?? {
            $schema: "./scm-workflow-state.schema.json",
            version: 1,
            state: "scaffold-complete",
            tier_topology: tierTopology,
            project_id: args.instance
          },
          state: "feature-claimed",
          feature_id: orphan.gitBranch.replace(/^feature\//, ""),
          branch: paired.gitBranch,
          parent_branch: parentBranch,
          lakebase_branch_uid: paired.branch.uid,
          claimed_at: (args.now ?? (() => /* @__PURE__ */ new Date()))().toISOString(),
          pr_url: void 0,
          pushed_at: void 0,
          ci_run_url: void 0,
          ci_green_at: void 0,
          merged_at: void 0
        };
        writeWorkflowState(args.projectDir, next);
        stateUpdated = true;
        result.stateUpdatedFor = orphan.gitBranch;
      }
      result.claimed.push({
        candidate: orphan,
        lakebaseBranchUid: paired.branch.uid,
        stateUpdated,
        warnings: paired.warnings
      });
    } catch (err) {
      throw new ScmRecoverError(
        `Substrate claim failed for ${orphan.gitBranch}: ${err instanceof Error ? err.message : String(err)}`,
        "substrate-failure"
      );
    }
  }
  return result;
}
function leafName2(b) {
  if (!b) return "";
  return b.name.split("/").pop() ?? b.name;
}
function parentForTopology(t, defaultLeaf) {
  if (t === 3) return "dev";
  if (t === 2) return "staging";
  return defaultLeaf || "main";
}

// scripts/lakebase/scm-doctor.ts
init_esm_shims();
import * as fs29 from "fs";
import { execFileSync as execFileSync6 } from "child_process";
import * as path29 from "path";
var FEATURE_PREFIX = "feature/";
var TIER_LEAFS2 = DEFAULT_PROTECTED_TIER_NAMES;
function readEnv(projectDir) {
  const envPath = path29.join(projectDir, ".env");
  const out = /* @__PURE__ */ new Map();
  if (!fs29.existsSync(envPath)) return out;
  const lines = fs29.readFileSync(envPath, "utf8").split("\n");
  for (const line of lines) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.+?)\s*$/);
    if (m) out.set(m[1], m[2].replace(/^["']|["']$/g, ""));
  }
  return out;
}
function leafOf2(b) {
  return b.name.split("/").pop() ?? b.name;
}
function isGitTracked(projectDir, rel) {
  try {
    execFileSync6("git", ["ls-files", "--error-unmatch", "--", rel], { cwd: projectDir, stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}
function worstOf(a, b) {
  const order = ["ok", "warn", "fail"];
  return order[Math.max(order.indexOf(a), order.indexOf(b))];
}
async function runDoctor(args, deps = {}) {
  const projectDir = args.projectDir;
  const findings = [];
  const env = readEnv(projectDir);
  const instance = args.instance ?? env.get("LAKEBASE_PROJECT_ID");
  const state = readWorkflowState(projectDir);
  const workflowStatePresent = state !== null;
  for (const stale of deps.findStaleBranches?.() ?? []) {
    const where = stale.feature_id ? ` ${stale.feature_id}/${stale.story_id}` : "";
    findings.push({
      id: `stale-${stale.kind}`,
      severity: "warn",
      message: `Stale ${stale.kind}${where} "${stale.slug}"${stale.branch ? ` (branch ${stale.branch})` : ""}: ${stale.reason}.`,
      suggestion: stale.kind === "experiment" ? `consort-experiment discard --feature ${stale.feature_id} --story ${stale.story_id} --slug ${stale.slug} --instance <id> --approver <you> --reason "doctor: stale experiment"` : "consort-spike teardown (or delete the spike's paired branch) once its learning has carried forward"
    });
  }
  if (!workflowStatePresent) {
    findings.push({
      id: "no-state-file",
      severity: "fail",
      message: "No .lakebase/workflow-state.json. Either the project pre-dates the SCM workflow or scaffold did not seed it.",
      suggestion: "lakebase-scm-adopt-state"
    });
  }
  try {
    const ownerRepo = await getOwnerRepo(projectDir);
    if (ownerRepo) {
      const enabled = await getActionsEnabled(ownerRepo);
      if (enabled === false) {
        findings.push({
          id: "github-actions-disabled",
          severity: "warn",
          message: `GitHub Actions is disabled for ${ownerRepo}, so the kit's CI workflows (pr.yml / merge.yml) will never run , the PR branch's migrations, tests, and schema-diff comment are all skipped. This is commonly an org-level policy on EMU repos, which a repo admin cannot override.`,
          suggestion: "Have an org owner enable Actions for this repo (repo Settings -> Actions -> General; if it says 'disabled by the organization', it must be enabled in the org's Actions policy). Until then, run the workflow steps locally: scripts/run-tests.sh against a Lakebase branch."
        });
      }
    }
  } catch {
  }
  for (const wf of ["pr.yml", "merge.yml"]) {
    try {
      const p = path29.join(projectDir, ".github", "workflows", wf);
      if (!fs29.existsSync(p)) continue;
      const body = fs29.readFileSync(p, "utf8");
      if (/lakebase-scm-utils#v\d/.test(body)) {
        findings.push({
          id: "ci-workflow-substrate-pin",
          severity: "warn",
          message: `.github/workflows/${wf} hardcodes a substrate version pin (github:databricks-solutions/lakebase-scm-utils#v<ver>) instead of resolving .lakebase/scm-utils-ref at runtime, so bumping .lakebase/scm-utils-ref does NOT change the substrate CI actually runs.`,
          suggestion: "Re-emit the workflows from the current substrate templates so they resolve SCM_UTILS_REF from .lakebase/scm-utils-ref at CI time (updateWorkflows in scripts/lakebase/workflow-drift.ts; lakebase-doctor reports this as workflow-drift). Until then a scm-utils-ref bump will not reach CI."
        });
      }
    } catch {
    }
  }
  try {
    if (isGitTracked(projectDir, ".lakebase/workflow-state.json")) {
      findings.push({
        id: "scm-state-git-tracked",
        severity: "warn",
        message: ".lakebase/workflow-state.json (the per-working-tree SCM claim state) is git-tracked, so a branch checkout or `git reset --hard origin/<tier>` can restore a stale committed claim over the live one (the foreign-claim guard then refuses to drive until you abandon + reclaim).",
        suggestion: "If a wrong-feature-claim refusal follows a checkout, run lakebase-scm-adopt-state (or abandon + reclaim) to re-establish the live claim. The kit-ref run pin (.lakebase/kit-ref.local) already protects the kit version from the same checkout revert."
      });
    }
  } catch {
  }
  if (!env.has("LAKEBASE_PROJECT_ID")) {
    findings.push({
      id: "env-missing-project-id",
      severity: "fail",
      message: ".env does not contain LAKEBASE_PROJECT_ID. The post-checkout hook will exit early; workflow CLIs will need an explicit --instance.",
      suggestion: "Set LAKEBASE_PROJECT_ID=<your project id> in .env"
    });
  }
  if (!instance) {
    return finalize({
      projectDir,
      workflowStatePresent,
      state: state ?? void 0,
      findings
    });
  }
  let lakebaseBranches = [];
  try {
    lakebaseBranches = await listBranches({ instance });
  } catch (err) {
    findings.push({
      id: "lakebase-unreachable",
      severity: "fail",
      message: `Could not list Lakebase branches for instance ${instance}: ${err instanceof Error ? err.message : String(err)}`,
      suggestion: "databricks auth login (or check DATABRICKS_CONFIG_PROFILE)."
    });
    return finalize({
      projectDir,
      workflowStatePresent,
      state: state ?? void 0,
      findings
    });
  }
  const inferredTopology = inferTierTopology(lakebaseBranches);
  if (state && state.tier_topology !== inferredTopology) {
    findings.push({
      id: "tier-topology-mismatch",
      severity: "warn",
      message: `workflow-state records tier_topology=${state.tier_topology}, but the Lakebase tier inventory suggests ${inferredTopology}.`,
      suggestion: "lakebase-scm-adopt-state --force"
    });
  }
  const headBranch = await getCurrentBranch({ cwd: projectDir });
  if (state && state.state === "feature-claimed") {
    if (state.branch && headBranch && headBranch !== state.branch) {
      findings.push({
        id: "head-branch-drift",
        severity: "warn",
        message: `workflow says feature-claimed for "${state.branch}", but HEAD is on "${headBranch}".`,
        suggestion: `git checkout '${state.branch}'`
      });
    }
    if (state.branch) {
      const sanitized = sanitizeBranchName(state.branch);
      let pair;
      try {
        pair = await getBranchByName(sanitized, { instance });
      } catch {
        pair = void 0;
      }
      if (!pair) {
        findings.push({
          id: "lakebase-pair-missing",
          severity: "fail",
          message: `workflow says feature-claimed for "${state.branch}", but no Lakebase branch "${sanitized}" exists.`,
          suggestion: `lakebase-scm-abandon-feature  # reset state; re-claim if needed`
        });
      } else if (state.lakebase_branch_uid && pair.uid !== state.lakebase_branch_uid) {
        findings.push({
          id: "lakebase-uid-drift",
          severity: "warn",
          message: `workflow records lakebase_branch_uid=${state.lakebase_branch_uid}, but the live branch reports ${pair.uid}.`,
          suggestion: "lakebase-scm-adopt-state --force"
        });
      }
    }
  }
  if (state && state.state === "feature-claimed" && state.branch) {
    const envBranchId = env.get("LAKEBASE_BRANCH_ID");
    const sanitized = sanitizeBranchName(state.branch);
    if (envBranchId && envBranchId !== sanitized) {
      findings.push({
        id: "env-branch-drift",
        severity: "warn",
        message: `.env LAKEBASE_BRANCH_ID=${envBranchId} but workflow says ${sanitized}. The post-checkout hook may not have run since the last branch switch.`,
        suggestion: `git checkout '${state.branch}'  # re-fires post-checkout`
      });
    }
  }
  if (headBranch && !TIER_LEAFS2.has(headBranch) && headBranch.startsWith(FEATURE_PREFIX)) {
    const sanitized = sanitizeBranchName(headBranch);
    const paired = lakebaseBranches.some((b) => leafOf2(b) === sanitized);
    if (!paired) {
      findings.push({
        id: "orphan-current-branch",
        severity: "fail",
        message: `Current git branch "${headBranch}" has no Lakebase pair (post-checkout fallback retired in phase C).`,
        suggestion: `lakebase-scm-recover-orphans --claim --only-branch '${headBranch}'`
      });
    }
  }
  try {
    const heads = await collapseMigrationHeads({ projectDir, dryRun: true });
    if (heads.headsBefore.length > 1) {
      findings.push({
        id: "multiple-migration-heads",
        severity: "fail",
        message: `Migrations have ${heads.headsBefore.length} heads (${heads.headsBefore.join(", ")}); a sibling-feature merge left them un-collapsed. \`upgrade head\` will refuse until they are unified.`,
        suggestion: "lakebase-collapse-heads"
      });
    }
  } catch {
  }
  if (instance && state?.branch) {
    try {
      const localIds = listSchemaMigrations({ projectDir }).map((m) => m.version);
      let orphanRev = null;
      try {
        const status = await schemaMigrationStatus({ instance, branch: state.branch, projectDir });
        if (dbRevisionOrphaned(status.current, localIds)) orphanRev = status.current ?? null;
      } catch (e) {
        orphanRev = parseAlembicMissingRevision(e instanceof Error ? e.message : String(e));
      }
      if (orphanRev) {
        findings.push({
          id: "db-ahead-of-code",
          severity: "fail",
          message: `The paired branch DB is AHEAD of code: applied revision '${orphanRev}' has no local migration file. An aborted build likely migrated this branch and a git reset removed the migration file; alembic accept/deploy/promote will fail "Can't locate revision".`,
          suggestion: "reset the paired branch DB to the code head (downgrade/stamp + drop reset-created tables), or delete the branch and re-cut it clean from its tier"
        });
      }
    } catch {
    }
  }
  return finalize({
    projectDir,
    workflowStatePresent,
    state: state ?? void 0,
    inferredTierTopology: inferredTopology,
    findings
  });
}
function finalize(report) {
  let worst = "ok";
  for (const f of report.findings) {
    worst = worstOf(worst, f.severity);
  }
  return { ...report, worstSeverity: worst };
}
var ScmDoctorFixError = class extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
    this.name = "ScmDoctorFixError";
  }
  code;
};
var FIXABLE_FINDING_IDS = [
  "env-branch-drift",
  "head-branch-drift",
  "tier-topology-mismatch",
  "orphan-current-branch",
  "multiple-migration-heads",
  "db-ahead-of-code"
];
async function fixFinding(args) {
  if (!FIXABLE_FINDING_IDS.includes(args.findingId)) {
    throw new ScmDoctorFixError(
      `Finding "${args.findingId}" is not supported by --fix. Supported: ${FIXABLE_FINDING_IDS.join(", ")}.`,
      "unsupported-finding"
    );
  }
  const report = args.report ?? await runDoctor({ projectDir: args.projectDir, instance: args.instance });
  const present = report.findings.find((f) => f.id === args.findingId);
  if (!present) {
    throw new ScmDoctorFixError(
      `Finding "${args.findingId}" is not present in the current report. Re-run lakebase-scm-doctor to see what needs fixing.`,
      "finding-not-present"
    );
  }
  let action = "";
  try {
    switch (args.findingId) {
      case "env-branch-drift": {
        const branch = report.state?.branch;
        if (!branch) {
          throw new ScmDoctorFixError(
            "Cannot fix: workflow state has no branch field.",
            "fix-failed"
          );
        }
        const sanitized = sanitizeBranchName(branch);
        const envFile = path29.join(args.projectDir, ".env");
        updateEnvConnection({
          envPath: envFile,
          projectId: readEnvVar(envFile, "LAKEBASE_PROJECT_ID") ?? "",
          branchId: sanitized,
          username: readEnvVar(envFile, "DB_USERNAME") ?? "",
          endpointHost: readEnvVar(envFile, "LAKEBASE_HOST")
        });
        action = `rewrote .env LAKEBASE_BRANCH_ID=${sanitized} (metadata only; the app mints its token at runtime)`;
        break;
      }
      case "head-branch-drift": {
        const branch = report.state?.branch;
        if (!branch) {
          throw new ScmDoctorFixError(
            "Cannot fix: workflow state has no branch field.",
            "fix-failed"
          );
        }
        await exec2(`git checkout ${shellEscape3(branch)}`, {
          cwd: args.projectDir,
          timeout: 15e3
        });
        action = `git checkout ${branch} (re-fires post-checkout to resync HEAD)`;
        break;
      }
      case "tier-topology-mismatch": {
        const instance = args.instance ?? report.state?.project_id;
        if (!instance) {
          throw new ScmDoctorFixError(
            "Cannot fix: missing Lakebase project id.",
            "fix-failed"
          );
        }
        await adoptScmState({
          projectDir: args.projectDir,
          instance,
          force: true
        });
        action = `adopted state with --force to re-infer tier_topology`;
        break;
      }
      case "orphan-current-branch": {
        const instance = args.instance ?? report.state?.project_id;
        if (!instance) {
          throw new ScmDoctorFixError(
            "Cannot fix: missing Lakebase project id.",
            "fix-failed"
          );
        }
        const headBranch = await getCurrentBranch({ cwd: args.projectDir });
        if (!headBranch) {
          throw new ScmDoctorFixError(
            "Cannot fix: detached HEAD or no current branch.",
            "fix-failed"
          );
        }
        await recoverOrphans({
          projectDir: args.projectDir,
          instance,
          claim: true,
          onlyBranch: headBranch
        });
        action = `recovered orphan ${headBranch} via createFeaturePairedBranch`;
        break;
      }
      case "multiple-migration-heads": {
        const r = await collapseMigrationHeads({ projectDir: args.projectDir });
        if (r.status !== "ok" || !r.mergeRevision) {
          throw new ScmDoctorFixError(
            `Expected to create a merge revision but got status="${r.status}".`,
            "fix-failed"
          );
        }
        action = `collapsed ${r.headsBefore.length} heads into merge revision ${r.mergeRevision} (commit it)`;
        break;
      }
      case "db-ahead-of-code": {
        const r = await abandonFeatureBranch({ projectDir: args.projectDir, instance: args.instance, force: true });
        action = `abandoned the feature (deleted the polluted paired branch${r.lakebaseDeleted ? "" : " , Lakebase delete reported not-deleted"}) and reset state to '${r.state.state}'; re-claim to re-fork a clean branch from the tier`;
        break;
      }
    }
  } catch (err) {
    if (err instanceof ScmDoctorFixError) throw err;
    throw new ScmDoctorFixError(
      `Remediation failed: ${err instanceof Error ? err.message : String(err)}`,
      "fix-failed"
    );
  }
  const postReport = await runDoctor({
    projectDir: args.projectDir,
    instance: args.instance
  });
  return { findingId: args.findingId, action, postReport };
}
function shellEscape3(s) {
  return `'${s.replace(/'/g, "'\\''")}'`;
}

// scripts/lakebase/doctor.ts
init_esm_shims();
import * as fs31 from "fs";
import * as path31 from "path";
import * as cp6 from "child_process";

// scripts/lakebase/workflow-drift.ts
init_esm_shims();
import * as fs30 from "fs";
import * as path30 from "path";
function findKitTemplatesDir(start) {
  let dir = start;
  for (let i = 0; i < 6; i++) {
    const candidate = path30.join(
      dir,
      "templates",
      "project",
      "common",
      ".github",
      "workflows"
    );
    if (fs30.existsSync(candidate)) return candidate;
    const parent = path30.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  throw new Error(
    `Could not locate templates/project/common/.github/workflows/ relative to ${start}. Pass explicit kitDir.`
  );
}
function unifiedDiff(name, projectContent, templateContent) {
  if (projectContent === templateContent) return "";
  const a = projectContent.split("\n");
  const b = templateContent.split("\n");
  const out = [`--- project/${name}`, `+++ template/${name}`];
  const max = Math.max(a.length, b.length);
  for (let i = 0; i < max; i++) {
    const av = a[i];
    const bv = b[i];
    if (av === bv) continue;
    if (av !== void 0) out.push(`-${i + 1}: ${av}`);
    if (bv !== void 0) out.push(`+${i + 1}: ${bv}`);
  }
  return out.join("\n");
}
function detectWorkflowDrift(args) {
  const projectWorkflowsDir = path30.join(
    args.projectDir,
    ".github",
    "workflows"
  );
  const here = path30.dirname(new URL(import.meta.url).pathname);
  const kitWorkflowsDir = args.kitDir ? path30.join(
    args.kitDir,
    "templates",
    "project",
    "common",
    ".github",
    "workflows"
  ) : findKitTemplatesDir(here);
  const templateFiles = fs30.existsSync(kitWorkflowsDir) ? fs30.readdirSync(kitWorkflowsDir).filter((f) => f.endsWith(".yml")) : [];
  const projectFiles = fs30.existsSync(projectWorkflowsDir) ? fs30.readdirSync(projectWorkflowsDir).filter((f) => f.endsWith(".yml")) : [];
  const version = readKitVersion(kitWorkflowsDir);
  const seen = /* @__PURE__ */ new Set();
  const files = [];
  for (const name of templateFiles) {
    seen.add(name);
    const projectPath2 = path30.join(projectWorkflowsDir, name);
    const templatePath = path30.join(kitWorkflowsDir, name);
    if (!fs30.existsSync(projectPath2)) {
      files.push({ name, status: "missing" });
      continue;
    }
    const projectContent = fs30.readFileSync(projectPath2, "utf8");
    const templateContent = applyPlaceholders(fs30.readFileSync(templatePath, "utf8"), version);
    if (projectContent === templateContent) {
      files.push({ name, status: "unchanged" });
    } else {
      files.push({
        name,
        status: "drifted",
        diff: unifiedDiff(name, projectContent, templateContent)
      });
    }
  }
  for (const name of projectFiles) {
    if (seen.has(name)) continue;
    files.push({ name, status: "extra" });
  }
  const order = {
    drifted: 0,
    missing: 1,
    extra: 2,
    unchanged: 3
  };
  files.sort((a, b) => order[a.status] - order[b.status] || a.name.localeCompare(b.name));
  const hasDrift = files.some((f) => f.status === "drifted" || f.status === "missing");
  return {
    overall: hasDrift ? "drift" : "ok",
    files
  };
}
function readKitVersion(kitWorkflowsDir) {
  let dir = kitWorkflowsDir;
  for (let i = 0; i < 5; i++) {
    dir = path30.dirname(dir);
  }
  try {
    const raw = fs30.readFileSync(path30.join(dir, "package.json"), "utf-8");
    const pkg = JSON.parse(raw);
    return typeof pkg.version === "string" ? pkg.version : "unknown";
  } catch {
    return "unknown";
  }
}
function applyPlaceholders(content, version) {
  return content.replace(/\{\{LAKEBASE_SCM_UTILS_VERSION\}\}/g, version);
}
function applyCommandPlaceholders(content, version) {
  return content.replace(/\$\{KIT_VERSION_AT_SCAFFOLD\}/g, version);
}
var COMMAND_HOOK_FILE_PATTERN = /\.(pre|post)-hook\.md$/;
function findKitCommandsDir(start) {
  let dir = start;
  for (let i = 0; i < 6; i++) {
    const candidate = path30.join(
      dir,
      "templates",
      "project",
      "common",
      ".claude",
      "commands"
    );
    if (fs30.existsSync(candidate)) return candidate;
    const parent = path30.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  throw new Error(
    `Could not locate templates/project/common/.claude/commands/ relative to ${start}. Pass explicit kitDir.`
  );
}
function parsePinnedVersion(content) {
  const m = content.match(/^\s*[*_>`\s]*pinned\s+to\s*:\s*[`*_]*([^\s`*_]+)[`*_]*\s*$/im);
  return m ? m[1] : void 0;
}
function detectCommandDrift(args) {
  const projectCommandsDir = path30.join(args.projectDir, ".claude", "commands");
  const here = path30.dirname(new URL(import.meta.url).pathname);
  const kitCommandsDir = args.kitDir ? path30.join(args.kitDir, "templates", "project", "common", ".claude", "commands") : findKitCommandsDir(here);
  const kitVersion = readKitVersionFromCommandsDir(kitCommandsDir);
  const templateFiles = fs30.existsSync(kitCommandsDir) ? fs30.readdirSync(kitCommandsDir).filter((f) => f.endsWith(".md") && !COMMAND_HOOK_FILE_PATTERN.test(f)) : [];
  const projectFiles = fs30.existsSync(projectCommandsDir) ? fs30.readdirSync(projectCommandsDir).filter((f) => f.endsWith(".md") && !COMMAND_HOOK_FILE_PATTERN.test(f)) : [];
  const seen = /* @__PURE__ */ new Set();
  const files = [];
  for (const name of templateFiles) {
    seen.add(name);
    const projectPath2 = path30.join(projectCommandsDir, name);
    const templatePath = path30.join(kitCommandsDir, name);
    const templateRaw = fs30.readFileSync(templatePath, "utf8");
    if (!fs30.existsSync(projectPath2)) {
      files.push({ name, status: "missing", kit_version: kitVersion });
      continue;
    }
    const projectContent = fs30.readFileSync(projectPath2, "utf8");
    const pinned = parsePinnedVersion(projectContent);
    const versionForCompare = pinned ?? kitVersion;
    const templateContent = applyCommandPlaceholders(templateRaw, versionForCompare);
    if (projectContent === templateContent) {
      files.push({
        name,
        status: "unchanged",
        pinned_version: pinned,
        kit_version: kitVersion
      });
    } else {
      files.push({
        name,
        status: "drifted",
        pinned_version: pinned,
        kit_version: kitVersion,
        diff: unifiedDiff(name, projectContent, templateContent)
      });
    }
  }
  for (const name of projectFiles) {
    if (seen.has(name)) continue;
    files.push({ name, status: "extra", kit_version: kitVersion });
  }
  const order = {
    drifted: 0,
    missing: 1,
    extra: 2,
    unchanged: 3
  };
  files.sort((a, b) => order[a.status] - order[b.status] || a.name.localeCompare(b.name));
  const hasDrift = files.some((f) => f.status === "drifted" || f.status === "missing");
  return { overall: hasDrift ? "drift" : "ok", files };
}
function readKitVersionFromCommandsDir(kitCommandsDir) {
  let dir = kitCommandsDir;
  for (let i = 0; i < 5; i++) {
    dir = path30.dirname(dir);
  }
  try {
    const raw = fs30.readFileSync(path30.join(dir, "package.json"), "utf-8");
    const pkg = JSON.parse(raw);
    return typeof pkg.version === "string" ? pkg.version : "unknown";
  } catch {
    return "unknown";
  }
}
function detectScaffoldedDrift(args) {
  const workflows = detectWorkflowDrift(args);
  const commands = detectCommandDrift(args);
  return {
    overall: workflows.overall === "drift" || commands.overall === "drift" ? "drift" : "ok",
    workflows,
    commands
  };
}
function updateWorkflows(args) {
  const projectWorkflowsDir = path30.join(
    args.projectDir,
    ".github",
    "workflows"
  );
  const here = path30.dirname(new URL(import.meta.url).pathname);
  const kitWorkflowsDir = args.kitDir ? path30.join(
    args.kitDir,
    "templates",
    "project",
    "common",
    ".github",
    "workflows"
  ) : findKitTemplatesDir(here);
  const substitute = args.substitute !== false;
  const dryRun = args.dryRun === true;
  const pruneExtras = args.pruneExtras === true;
  const templateFiles = fs30.existsSync(kitWorkflowsDir) ? fs30.readdirSync(kitWorkflowsDir).filter((f) => f.endsWith(".yml")) : [];
  const projectFiles = fs30.existsSync(projectWorkflowsDir) ? fs30.readdirSync(projectWorkflowsDir).filter((f) => f.endsWith(".yml")) : [];
  if (!dryRun && templateFiles.length > 0 && !fs30.existsSync(projectWorkflowsDir)) {
    fs30.mkdirSync(projectWorkflowsDir, { recursive: true });
  }
  const version = substitute ? readKitVersion(kitWorkflowsDir) : "";
  const seen = /* @__PURE__ */ new Set();
  const files = [];
  for (const name of templateFiles) {
    seen.add(name);
    const projectPath2 = path30.join(projectWorkflowsDir, name);
    const templatePath = path30.join(kitWorkflowsDir, name);
    const templateRaw = fs30.readFileSync(templatePath, "utf-8");
    const desired = substitute ? applyPlaceholders(templateRaw, version) : templateRaw;
    const existed = fs30.existsSync(projectPath2);
    const current = existed ? fs30.readFileSync(projectPath2, "utf-8") : "";
    let outcome;
    if (!existed) {
      outcome = "added";
    } else if (current === desired) {
      outcome = "unchanged";
    } else {
      outcome = "updated";
    }
    if (!dryRun && outcome !== "unchanged") {
      fs30.writeFileSync(projectPath2, desired);
    }
    files.push({ name, outcome });
  }
  if (pruneExtras) {
    for (const name of projectFiles) {
      if (seen.has(name)) continue;
      const projectPath2 = path30.join(projectWorkflowsDir, name);
      if (!dryRun) {
        fs30.unlinkSync(projectPath2);
      }
      files.push({ name, outcome: "removed" });
    }
  }
  const order = {
    added: 0,
    updated: 1,
    removed: 2,
    unchanged: 3
  };
  files.sort((a, b) => order[a.outcome] - order[b.outcome] || a.name.localeCompare(b.name));
  const changed = files.some((f) => f.outcome !== "unchanged");
  return { files, changed };
}

// scripts/lakebase/doctor.ts
function readEnvFile(projectDir) {
  const envPath = path31.join(projectDir, ".env");
  if (!fs31.existsSync(envPath)) return {};
  const out = {};
  for (const line of fs31.readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    let val = m[2];
    if (val.startsWith('"') && val.endsWith('"') || val.startsWith("'") && val.endsWith("'")) {
      val = val.slice(1, -1);
    }
    out[m[1]] = val;
  }
  return out;
}
async function checkDatabricksCli() {
  try {
    const out = await runDatabricks(["--version"], {
      timeout: 5e3,
      noProfile: true
    });
    const trimmed = out.trim();
    const m = trimmed.match(/v?(\d+)\.(\d+)/);
    if (m) {
      const major = parseInt(m[1], 10);
      if (major < 1) {
        return {
          name: "databricks-cli",
          status: "warn",
          message: `Databricks CLI ${trimmed} - kit expects v1.0+`,
          detail: { version: trimmed },
          hint: "Upgrade via Homebrew or the installer at https://docs.databricks.com/dev-tools/cli/install.html"
        };
      }
    }
    return {
      name: "databricks-cli",
      status: "ok",
      message: `Databricks CLI ${trimmed}`,
      detail: { version: trimmed }
    };
  } catch (err) {
    return {
      name: "databricks-cli",
      status: "fail",
      message: "databricks CLI not found on PATH",
      detail: { error: err.message },
      hint: "Install via Homebrew (`brew install databricks-cli`) or the official installer."
    };
  }
}
var defaultVersionRunner = (cmd, args) => new Promise((resolve2, reject) => {
  cp6.execFile(cmd, args, { timeout: 5e3 }, (err, stdout, stderr) => {
    const combined = `${stdout ?? ""}
${stderr ?? ""}`.trim();
    if (combined) return resolve2(combined);
    if (err) return reject(err);
    resolve2("");
  });
});
function parseVersion(s) {
  const m = s.match(/v?(\d+)(?:\.(\d+))?/);
  if (!m) return null;
  return { major: parseInt(m[1], 10), minor: m[2] ? parseInt(m[2], 10) : 0 };
}
var PREREQS = [
  {
    name: "node",
    cmd: "node",
    versionArgs: ["--version"],
    minMajor: 20,
    label: "Node.js",
    hint: "Install Node.js 20+ (e.g. `brew install node@20`, nvm, or https://nodejs.org)."
  },
  {
    name: "npm",
    cmd: "npm",
    versionArgs: ["--version"],
    minMajor: null,
    label: "npm",
    hint: "npm ships with Node.js 20+; reinstall Node if it is missing."
  },
  {
    name: "python",
    cmd: "python3",
    versionArgs: ["--version"],
    minMajor: 3,
    minMinor: 10,
    label: "Python",
    hint: "Install Python 3.10+ (e.g. `brew install python@3.11` or https://www.python.org/downloads)."
  },
  {
    name: "jdk",
    cmd: "java",
    versionArgs: ["-version"],
    minMajor: 17,
    label: "JDK",
    hint: "Install JDK 17+ (e.g. `brew install openjdk@17`); required for the Flyway live path."
  },
  {
    name: "gh",
    cmd: "gh",
    versionArgs: ["--version"],
    minMajor: null,
    label: "GitHub CLI",
    hint: "Install the GitHub CLI (`brew install gh`) and authenticate with `gh auth login`."
  }
];
async function checkPrereq(spec, run) {
  let raw;
  try {
    raw = await run(spec.cmd, spec.versionArgs);
  } catch (err) {
    const errText = err.message ?? "";
    const recovered = /version/i.test(errText) ? parseVersion(errText) : null;
    if (recovered) {
      raw = errText;
    } else {
      return {
        name: spec.name,
        status: "fail",
        message: `${spec.label} not found on PATH`,
        detail: { error: errText },
        hint: spec.hint
      };
    }
  }
  const trimmed = raw.trim().split("\n")[0]?.trim() ?? raw.trim();
  const version = parseVersion(trimmed);
  if (spec.minMajor !== null) {
    const floor = spec.minMinor != null ? `${spec.minMajor}.${spec.minMinor}` : `${spec.minMajor}`;
    if (!version) {
      return {
        name: spec.name,
        status: "warn",
        message: `${spec.label} present but version unreadable - kit expects ${floor}+`,
        detail: { version: trimmed, minMajor: spec.minMajor, minMinor: spec.minMinor ?? null },
        hint: spec.hint
      };
    }
    const belowFloor = version.major < spec.minMajor || spec.minMinor != null && version.major === spec.minMajor && version.minor < spec.minMinor;
    if (belowFloor) {
      return {
        name: spec.name,
        status: "warn",
        message: `${spec.label} ${trimmed} - kit expects ${floor}+`,
        detail: { version: trimmed, minMajor: spec.minMajor, minMinor: spec.minMinor ?? null },
        hint: spec.hint
      };
    }
  }
  return {
    name: spec.name,
    status: "ok",
    message: `${spec.label} ${trimmed}`,
    detail: { version: trimmed }
  };
}
async function checkPrerequisites(run = defaultVersionRunner) {
  return Promise.all(PREREQS.map((spec) => checkPrereq(spec, run)));
}
async function checkLakebaseEnabled(profile, listInstances) {
  const run = listInstances ?? (() => runDatabricks(["database", "list-database-instances", "-o", "json"], {
    profile,
    timeout: 15e3
  }));
  try {
    const out = await run();
    let count;
    try {
      const parsed = JSON.parse(out || "[]");
      count = Array.isArray(parsed) ? parsed.length : Array.isArray(parsed?.database_instances) ? parsed.database_instances.length : void 0;
    } catch {
    }
    return {
      name: "lakebase-enabled",
      status: "ok",
      message: count === void 0 ? "Workspace has Lakebase enabled" : `Workspace has Lakebase enabled (${count} database instance${count === 1 ? "" : "s"})`,
      detail: { instanceCount: count }
    };
  } catch (err) {
    return {
      name: "lakebase-enabled",
      status: "fail",
      message: "Workspace does not have Lakebase enabled (or account lacks access)",
      detail: { error: err.message },
      hint: "Enable Lakebase (Database Instances) on this workspace, or point at a workspace where it is enabled. Consort has no mock mode; a real Lakebase workspace is required."
    };
  }
}
async function checkAuth(profile, host) {
  try {
    await runDatabricks(["auth", "token", "--force-refresh", "-o", "json"], {
      profile,
      host,
      timeout: 8e3
    });
    let describedHost;
    try {
      const out = await runDatabricks(["auth", "describe", "-o", "json"], { profile, host, timeout: 5e3 });
      const parsed = JSON.parse(out);
      describedHost = parsed?.details?.host ?? parsed?.host ?? parsed?.host_name;
    } catch {
    }
    const shownHost = describedHost ?? host;
    return {
      name: "databricks-auth",
      status: "ok",
      message: shownHost ? `Authenticated to ${shownHost}` : "Authenticated (refresh token valid)",
      detail: { host: shownHost, profile: profile ?? "default" }
    };
  } catch (err) {
    return {
      name: "databricks-auth",
      status: "fail",
      message: "databricks auth token failed (session expired or not logged in)",
      detail: { error: err.message },
      hint: "Run `databricks auth login --host <your-workspace>` to re-authenticate (the OAuth refresh token is expired/invalid)."
    };
  }
}
async function checkIdentity(profile, host) {
  try {
    const out = await runDatabricks(["current-user", "me", "-o", "json"], {
      profile,
      host,
      timeout: 5e3
    });
    let user;
    try {
      const parsed = JSON.parse(out);
      user = parsed?.userName ?? parsed?.emails?.[0]?.value;
    } catch {
    }
    return {
      name: "workspace-identity",
      status: "ok",
      message: user ? `Workspace reachable as ${user}` : "Workspace reachable",
      detail: { user }
    };
  } catch (err) {
    return {
      name: "workspace-identity",
      status: "fail",
      message: "Cannot resolve current user from workspace",
      detail: { error: err.message },
      hint: "Re-authenticate via `databricks auth login` and verify network connectivity."
    };
  }
}
function checkEnv(projectDir) {
  const env = readEnvFile(projectDir);
  const required = ["LAKEBASE_PROJECT_ID", "LAKEBASE_BRANCH_ID"];
  const missing = required.filter((k) => !env[k]);
  if (Object.keys(env).length === 0) {
    return {
      name: "env-file",
      status: "warn",
      message: ".env not found",
      detail: { projectDir, envPath: path31.join(projectDir, ".env") },
      hint: "Run `lakebase-get-connection --output dsn --write-env` or `lakebase-branch sync-env`."
    };
  }
  if (missing.length) {
    return {
      name: "env-file",
      status: "fail",
      message: `.env missing required vars: ${missing.join(", ")}`,
      detail: { presentKeys: Object.keys(env), missing },
      hint: "Re-run `lakebase-branch sync-env` to regenerate .env from the current branch."
    };
  }
  return {
    name: "env-file",
    status: "ok",
    message: `.env present with required keys (LAKEBASE_PROJECT_ID=${env.LAKEBASE_PROJECT_ID})`,
    detail: { keys: Object.keys(env).length, projectId: env.LAKEBASE_PROJECT_ID }
  };
}
async function checkConfigProfile(env) {
  const host = env.DATABRICKS_HOST;
  if (env.DATABRICKS_CONFIG_PROFILE) {
    return {
      name: "config-profile",
      status: "ok",
      message: `CLI profile pinned: ${env.DATABRICKS_CONFIG_PROFILE}`,
      detail: { profile: env.DATABRICKS_CONFIG_PROFILE }
    };
  }
  if (!host) {
    return {
      name: "config-profile",
      status: "skip",
      message: "Skipped: no DATABRICKS_HOST in .env"
    };
  }
  let resolved;
  try {
    resolved = await resolveProfileForHost(host);
  } catch {
  }
  if (!resolved) {
    return {
      name: "config-profile",
      status: "ok",
      message: "No profile pin needed (no unique CLI profile matches this host)",
      detail: { host }
    };
  }
  return {
    name: "config-profile",
    status: "warn",
    message: `.env has no DATABRICKS_CONFIG_PROFILE; host maps to valid profile "${resolved}"`,
    detail: { host, resolvedProfile: resolved },
    hint: `Run \`lakebase-doctor --fix\` (or add DATABRICKS_CONFIG_PROFILE=${resolved} to .env) so the hooks' auth preflight resolves the cached token.`
  };
}
async function checkLakebaseProject(projectId, host) {
  if (!projectId) {
    return {
      name: "lakebase-project",
      status: "skip",
      message: "Skipped: no LAKEBASE_PROJECT_ID in .env"
    };
  }
  try {
    const branches = await listBranches({ instance: projectId, host });
    return {
      name: "lakebase-project",
      status: "ok",
      message: `Project ${projectId} reachable (${branches.length} branches)`,
      detail: {
        projectId,
        branchCount: branches.length,
        branchNames: branches.map((b) => b.name)
      }
    };
  } catch (err) {
    return {
      name: "lakebase-project",
      status: "fail",
      message: `Cannot list branches on project ${projectId}`,
      detail: { error: err.message },
      hint: "Verify the project exists and your account has CAN_USE on it."
    };
  }
}
async function checkGitRemote(projectDir) {
  try {
    const url = (await exec2("git remote get-url origin", {
      cwd: projectDir,
      timeout: 5e3
    })).trim();
    if (!url) {
      return {
        name: "git-remote",
        status: "warn",
        message: "No origin remote configured"
      };
    }
    return {
      name: "git-remote",
      status: "ok",
      message: `origin -> ${url}`,
      detail: { url }
    };
  } catch (err) {
    return {
      name: "git-remote",
      status: "warn",
      message: "git remote get-url origin failed",
      detail: { error: err.message },
      hint: "Run `git remote add origin <url>` if this is a fresh repo."
    };
  }
}
function checkLanguage(projectDir) {
  try {
    const lang = detectLanguage(projectDir);
    return {
      name: "detected-language",
      status: "ok",
      message: `Project language: ${lang}`,
      detail: { language: lang }
    };
  } catch (err) {
    return {
      name: "detected-language",
      status: "warn",
      message: "Could not detect project language",
      detail: { error: err.message }
    };
  }
}
function checkHooks(projectDir) {
  const v = verifyHooks(projectDir);
  const installed = Object.entries(v).filter(([, ok]) => ok).map(([k]) => k);
  const missing = Object.entries(v).filter(([, ok]) => !ok).map(([k]) => k);
  if (missing.length === 0) {
    return {
      name: "git-hooks",
      status: "ok",
      message: `All ${installed.length} project git hooks installed`,
      detail: v
    };
  }
  return {
    name: "git-hooks",
    status: "warn",
    message: `Missing git hooks: ${missing.join(", ")}`,
    detail: v,
    hint: "Re-run `lakebase-create-project --install-hooks` or copy the hook files from the kit's templates."
  };
}
function checkWorkflowDrift(projectDir) {
  try {
    const report = detectWorkflowDrift({ projectDir });
    const drifted = report.files.filter((f) => f.status === "drifted").length;
    const missing = report.files.filter((f) => f.status === "missing").length;
    if (report.overall === "ok") {
      return {
        name: "workflow-drift",
        status: "ok",
        message: "Scaffolded .github/workflows/*.yml match the kit's templates",
        detail: { files: report.files.map((f) => ({ name: f.name, status: f.status })) }
      };
    }
    return {
      name: "workflow-drift",
      status: "warn",
      message: `Scaffolded workflows drift from kit: ${drifted} drifted, ${missing} missing`,
      detail: { files: report.files.map((f) => ({ name: f.name, status: f.status })) },
      hint: "Inspect via the lakebase_workflow_drift MCP tool (or detectWorkflowDrift import). Refresh manually until updateWorkflows lands."
    };
  } catch (err) {
    return {
      name: "workflow-drift",
      status: "skip",
      message: "Could not run drift check",
      detail: { error: err.message }
    };
  }
}
function worstOf2(statuses) {
  const order = ["ok", "skip", "warn", "fail"];
  return statuses.reduce(
    (acc, s) => order.indexOf(s) > order.indexOf(acc) ? s : acc,
    "ok"
  );
}
async function runDoctor2(args = {}) {
  const projectDir = args.projectDir ?? process.cwd();
  let profile = args.profile ?? process.env.DATABRICKS_CONFIG_PROFILE;
  let host = args.host;
  if (!profile && host) {
    try {
      profile = await resolveProfileForHost(host);
    } catch {
    }
  }
  const cli = await checkDatabricksCli();
  const auth7 = cli.status === "ok" ? await checkAuth(profile, host) : {
    name: "databricks-auth",
    status: "skip",
    message: "Skipped: databricks CLI not available"
  };
  const identity = auth7.status === "ok" ? await checkIdentity(profile, host) : {
    name: "workspace-identity",
    status: "skip",
    message: "Skipped: auth check failed"
  };
  if (!host && auth7.status === "ok") {
    try {
      host = await resolveDatabricksHost({ profile: profile ?? "DEFAULT" });
    } catch {
    }
  }
  const env = checkEnv(projectDir);
  const envVars = readEnvFile(projectDir);
  const configProfile = await checkConfigProfile(envVars);
  const lakebaseProject = await checkLakebaseProject(
    envVars.LAKEBASE_PROJECT_ID ?? "",
    host
  );
  const gitRemote = await checkGitRemote(projectDir);
  const language = checkLanguage(projectDir);
  const hooks = checkHooks(projectDir);
  const workflowDrift = checkWorkflowDrift(projectDir);
  const prereqs = await checkPrerequisites();
  const lakebaseEnabled = auth7.status === "ok" ? await checkLakebaseEnabled(profile) : {
    name: "lakebase-enabled",
    status: "skip",
    message: "Skipped: auth check failed"
  };
  const checks = [
    cli,
    ...prereqs,
    auth7,
    identity,
    lakebaseEnabled,
    env,
    configProfile,
    lakebaseProject,
    gitRemote,
    language,
    hooks,
    workflowDrift
  ];
  return {
    overall: worstOf2(checks.map((c) => c.status)),
    checks
  };
}

// scripts/lakebase/secret-auth.ts
init_esm_shims();
var NINETY_DAYS_SECONDS = 90 * 24 * 60 * 60;
async function ensureLakebaseSecretAuth(args) {
  const timeoutMs = args.timeoutMs ?? KIT_TIMEOUTS.cliDefault;
  const tokenLifetimeSeconds = args.tokenLifetimeSeconds ?? NINETY_DAYS_SECONDS;
  const tokenComment = args.tokenComment ?? `Lakebase auth (scope=${args.scopeName})`;
  const { profile, scopeName, keyName, servicePrincipalClientId } = args;
  let scopeCreated = false;
  try {
    await runDatabricks(["secrets", "create-scope", scopeName], { profile, timeout: timeoutMs });
    scopeCreated = true;
  } catch (err) {
    const msg = err.message;
    if (!isAlreadyExistsError(msg)) throw err;
  }
  const tokenJson = await runDatabricks(
    ["tokens", "create", "--comment", tokenComment, "--lifetime-seconds", String(tokenLifetimeSeconds), "-o", "json"],
    { profile, timeout: timeoutMs }
  );
  const tokenStart = tokenJson.indexOf("{");
  if (tokenStart < 0) {
    throw new Error(`databricks tokens create returned no JSON: ${tokenJson.slice(0, 200)}`);
  }
  const parsed = JSON.parse(tokenJson.slice(tokenStart));
  const pat = parsed.token_value;
  if (typeof pat !== "string" || !pat) {
    throw new Error("databricks tokens create returned no token_value");
  }
  await runDatabricks(["secrets", "put-secret", scopeName, keyName, "--string-value", pat], {
    profile,
    timeout: timeoutMs
  });
  let aclGranted = false;
  if (servicePrincipalClientId) {
    try {
      await runDatabricks(["secrets", "put-acl", scopeName, servicePrincipalClientId, "READ"], {
        profile,
        timeout: timeoutMs
      });
      aclGranted = true;
    } catch {
    }
  }
  return {
    scope: scopeName,
    key: keyName,
    scopeCreated,
    patStored: true,
    aclGranted
  };
}
function isAlreadyExistsError(msg) {
  return /already exists|SCOPE_ALREADY_EXISTS|RESOURCE_ALREADY_EXISTS/i.test(msg);
}

// scripts/lakebase/uc-resources.ts
init_esm_shims();
var DEFAULT_CREATE_COMMENT = "Created by lakebase-scm-utils";
async function catalogExists(args) {
  const timeoutMs = args.timeoutMs ?? KIT_TIMEOUTS.cliDefault;
  try {
    await runDatabricks(["api", "get", `/api/2.1/unity-catalog/catalogs/${args.catalog}`], {
      profile: args.profile,
      timeout: timeoutMs
    });
    return true;
  } catch (err) {
    if (isUcMissingError(err.message)) return false;
    throw err;
  }
}
async function tryCreateCatalog(args) {
  const timeoutMs = args.timeoutMs ?? KIT_TIMEOUTS.cliDefault;
  const comment = args.comment ?? DEFAULT_CREATE_COMMENT;
  const payload = JSON.stringify({ name: args.catalog, comment });
  try {
    await runDatabricks(["api", "post", "/api/2.1/unity-catalog/catalogs", "--json", payload], {
      profile: args.profile,
      timeout: timeoutMs
    });
    return { created: true };
  } catch (err) {
    return { created: false, error: err.message };
  }
}
async function ensureSchemaAndVolume(args) {
  const timeoutMs = args.timeoutMs ?? KIT_TIMEOUTS.cliDefault;
  const comment = args.comment ?? DEFAULT_CREATE_COMMENT;
  const volumeType = args.volumeType ?? "MANAGED";
  const { profile, catalog, schema, volume } = args;
  let schemaCreated = false;
  let exists = await ucResourceExists(`/api/2.1/unity-catalog/schemas/${catalog}.${schema}`, profile, timeoutMs);
  if (!exists) {
    const payload = JSON.stringify({ name: schema, catalog_name: catalog, comment });
    await runDatabricks(["api", "post", "/api/2.1/unity-catalog/schemas", "--json", payload], {
      profile,
      timeout: timeoutMs
    });
    schemaCreated = true;
  }
  let volumeCreated = false;
  exists = await ucResourceExists(
    `/api/2.1/unity-catalog/volumes/${catalog}.${schema}.${volume}`,
    profile,
    timeoutMs
  );
  if (!exists) {
    const payload = JSON.stringify({
      catalog_name: catalog,
      schema_name: schema,
      name: volume,
      volume_type: volumeType,
      comment
    });
    await runDatabricks(["api", "post", "/api/2.1/unity-catalog/volumes", "--json", payload], {
      profile,
      timeout: timeoutMs
    });
    volumeCreated = true;
  }
  return { schemaCreated, volumeCreated };
}
var DEFAULT_APP_PERMS = [
  "USE_CATALOG",
  "USE_SCHEMA",
  "READ_VOLUME",
  "WRITE_VOLUME"
];
async function grantUcCatalogPermission(args) {
  const timeoutMs = args.timeoutMs ?? KIT_TIMEOUTS.cliDefault;
  const permissions = args.permissions ?? DEFAULT_APP_PERMS;
  const payload = JSON.stringify({
    changes: [
      {
        principal: args.servicePrincipalName,
        add: permissions
      }
    ]
  });
  await runDatabricks(
    ["api", "patch", `/api/2.1/unity-catalog/permissions/catalog/${args.catalog}`, "--json", payload],
    { profile: args.profile, timeout: timeoutMs }
  );
  return { granted: true };
}
function catalogExplorerUrl(workspaceHost) {
  return `${workspaceHost.replace(/\/+$/, "")}/explore/data`;
}
async function ucResourceExists(apiPath, profile, timeoutMs) {
  try {
    await runDatabricks(["api", "get", apiPath], { profile, timeout: timeoutMs });
    return true;
  } catch (err) {
    if (isUcMissingError(err.message)) return false;
    throw err;
  }
}
function isUcMissingError(msg) {
  return /RESOURCE_DOES_NOT_EXIST|does not exist|status:? 404\b|NOT_FOUND/i.test(msg);
}

// scripts/git/index.ts
init_esm_shims();

// scripts/git/ancestry.ts
init_esm_shims();
async function resolveNearestParent(args) {
  const { cwd } = args;
  const tipRef = args.tip && args.tip.length > 0 ? args.tip : "HEAD";
  let tipBranchName = "";
  if (args.tip && args.tip.length > 0) {
    tipBranchName = args.tip;
  } else {
    try {
      tipBranchName = await exec2("git rev-parse --abbrev-ref HEAD", { cwd });
    } catch {
    }
  }
  let best;
  for (const c of args.candidates) {
    if (!c || c === tipBranchName) continue;
    try {
      const baseSha = await exec2(`git merge-base "${tipRef}" "${c}"`, { cwd });
      if (!baseSha) continue;
      const tsStr = await exec2(`git log -1 --format=%at "${baseSha}"`, {
        cwd
      });
      const ts = parseInt(tsStr, 10) || 0;
      if (!best || ts > best.ts) {
        best = { name: c, baseSha, ts };
      }
    } catch {
    }
  }
  return best ? { name: best.name, baseSha: best.baseSha } : void 0;
}
async function getNearestParentName(args) {
  const parent = await resolveNearestParent(args);
  return parent?.name ?? "";
}
async function getMergeBase(args) {
  const parent = await resolveNearestParent(args);
  if (parent?.baseSha) return parent.baseSha;
  const { cwd } = args;
  const tipRef = args.tip && args.tip.length > 0 ? args.tip : "HEAD";
  const fallbacks = args.fallbacks ?? ["main", "master"];
  for (const fb of fallbacks) {
    try {
      await exec2(`git rev-parse --verify ${fb}`, { cwd });
      return await exec2(`git merge-base ${fb} ${tipRef}`, { cwd });
    } catch {
    }
  }
  return "";
}

// scripts/git/migrations.ts
init_esm_shims();
var DEFAULT_PATTERN = /^V\d+.*\.sql$/i;
async function listMigrationsOnBranch(args) {
  const { cwd, branch, migrationPath, pattern = DEFAULT_PATTERN } = args;
  if (!branch || !migrationPath) return [];
  try {
    const raw = await exec2(
      `git ls-tree --name-only "${branch}" -- "${migrationPath}/"`,
      { cwd }
    );
    if (!raw) return [];
    return raw.split("\n").map((f) => f.split("/").pop() || f).filter((f) => pattern.test(f)).sort();
  } catch {
    return [];
  }
}

// scripts/git/commits.ts
init_esm_shims();
import { existsSync as existsSync30 } from "fs";
import { join as join33 } from "path";
var SOURCE_EXTENSIONS = /* @__PURE__ */ new Set([
  ".py",
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".java",
  ".kt",
  ".kts",
  ".go",
  ".rb",
  ".rs",
  ".php",
  ".cs",
  ".scala",
  ".sql",
  ".html",
  ".htm",
  ".css",
  ".scss",
  ".less",
  ".vue",
  ".svelte",
  ".json",
  ".yaml",
  ".yml",
  ".toml",
  ".ini",
  ".cfg",
  ".conf",
  ".xml",
  ".md",
  ".sh",
  ".bash",
  ".env",
  ".gradle",
  ".properties"
]);
var ROOT_PROJECT_FILES = /* @__PURE__ */ new Set([
  "uv.lock",
  "poetry.lock",
  "Pipfile.lock",
  "requirements.txt",
  "requirements-dev.txt",
  "package-lock.json",
  "yarn.lock",
  "pnpm-lock.yaml",
  "npm-shrinkwrap.json",
  "Cargo.lock",
  "go.mod",
  "go.sum",
  "Gemfile",
  "Gemfile.lock",
  "composer.lock"
]);
async function commit(args) {
  if (!args.message.trim()) {
    throw new Error("Commit message is required");
  }
  await exec2(`git commit -m ${shq(args.message)}`, {
    cwd: args.cwd
  });
}
async function commitAll(args) {
  if (!args.message.trim()) {
    throw new Error("Commit message is required");
  }
  await exec2("git add -A", { cwd: args.cwd });
  await exec2(`git commit -m ${shq(args.message)}`, {
    cwd: args.cwd
  });
}
async function commitAllIfChanged(args) {
  if (!args.message.trim()) {
    throw new Error("Commit message is required");
  }
  const exclude = args.exclude ?? [];
  const ex = exclude.length > 0 ? " " + exclude.map((p) => shq(`:(exclude)${p.replace(/\/+$/, "")}`)).join(" ") : "";
  const allow = args.untrackedAllow ?? [];
  if (allow.length > 0) {
    await exec2(`git add -u -- .${ex}`, { cwd: args.cwd });
    const excludeDirs = exclude.map((p) => p.replace(/\/+$/, ""));
    const underDir = (f, d) => f === d || f.startsWith(`${d}/`);
    const untracked = (await exec2("git ls-files --others --exclude-standard", { cwd: args.cwd })).split("\n").map((s) => s.trim()).filter(Boolean);
    for (const f of untracked) {
      if (excludeDirs.some((d) => underDir(f, d))) continue;
      const slash = f.lastIndexOf("/");
      const dot = f.lastIndexOf(".");
      const ext = dot > slash ? f.slice(dot).toLowerCase() : "";
      const base = f.slice(slash + 1);
      if (allow.some((d) => underDir(f, d)) || SOURCE_EXTENSIONS.has(ext) || ROOT_PROJECT_FILES.has(base)) {
        await exec2(`git add -- ${shq(f)}`, { cwd: args.cwd });
      }
    }
  } else if (exclude.length > 0) {
    await exec2(`git add -A -- .${ex}`, { cwd: args.cwd });
  } else {
    await exec2("git add -A", { cwd: args.cwd });
  }
  for (const inc of args.include ?? []) {
    if (existsSync30(join33(args.cwd, inc))) {
      await exec2(`git add -f -- ${shq(inc)}`, { cwd: args.cwd });
    }
  }
  const staged = await exec2("git diff --cached --name-only", { cwd: args.cwd });
  if (!staged.trim()) return false;
  await exec2(`git commit -m ${shq(args.message)}`, { cwd: args.cwd });
  return true;
}
async function commitSignedOff(args) {
  if (!args.message.trim()) {
    throw new Error("Commit message is required");
  }
  await exec2(`git commit -s -m ${shq(args.message)}`, {
    cwd: args.cwd
  });
}
async function commitAllSignedOff(args) {
  if (!args.message.trim()) {
    throw new Error("Commit message is required");
  }
  await exec2("git add -A", { cwd: args.cwd });
  await exec2(`git commit -s -m ${shq(args.message)}`, {
    cwd: args.cwd
  });
}
async function commitAmend(args) {
  if (args.message !== void 0) {
    if (!args.message.trim()) {
      throw new Error("Commit message is required");
    }
    await exec2(
      `git commit --amend -m ${shq(args.message)}`,
      { cwd: args.cwd }
    );
  } else {
    await exec2("git commit --amend --no-edit", { cwd: args.cwd });
  }
}
async function undoLastCommit(args) {
  await exec2("git reset --soft HEAD~1", { cwd: args.cwd });
}
async function discardAllChanges(args) {
  if (args.confirm !== true) {
    throw new Error(
      "discardAllChanges requires confirm: true (destructive operation)"
    );
  }
  await exec2("git checkout -- .", { cwd: args.cwd });
  await exec2("git clean -fd", { cwd: args.cwd });
}

// scripts/git/sync.ts
init_esm_shims();
async function currentBranchName2(cwd) {
  try {
    return await exec2("git rev-parse --abbrev-ref HEAD", { cwd });
  } catch {
    return "";
  }
}
async function push(args) {
  await exec2("git push", { cwd: args.cwd });
}
async function pull(args) {
  await exec2("git pull", { cwd: args.cwd });
}
async function publishBranch(args) {
  const remote = args.remote ?? "origin";
  const branch = await currentBranchName2(args.cwd);
  if (!branch) throw new Error("No current branch");
  await exec2(`git push -u ${remote} ${shq(branch)}`, {
    cwd: args.cwd
  });
}
async function pushCurrentBranchForPr(args) {
  const remote = args.remote ?? "origin";
  const branch = await currentBranchName2(args.cwd);
  if (!branch) throw new Error("No current branch");
  const upstreamSet = await hasUpstream({ cwd: args.cwd });
  if (!upstreamSet) {
    await exec2(`git push -u ${remote} ${shq(branch)}`, {
      cwd: args.cwd
    });
  } else {
    await exec2("git push", { cwd: args.cwd });
  }
}
async function fetch2(args) {
  const parts = ["git fetch"];
  if (args.prune) parts.push("--prune");
  if (args.all) parts.push("--all");
  await exec2(parts.join(" "), { cwd: args.cwd });
}
async function pullFrom(args) {
  await exec2(`git pull ${shq(args.remote)} ${shq(args.branch)}`, {
    cwd: args.cwd
  });
}
async function pushTo(args) {
  await exec2(`git push ${shq(args.remote)} ${shq(args.branch)}`, {
    cwd: args.cwd
  });
}
async function sync(args) {
  await exec2("git pull", { cwd: args.cwd });
  await exec2("git push", { cwd: args.cwd });
}

// scripts/git/branch-tag.ts
init_esm_shims();
var PROTECTED_BRANCHES = /* @__PURE__ */ new Set(["production", "main", "master"]);
var ProtectedBranchError = class extends Error {
  constructor(branch) {
    super(
      `Refusing to delete protected branch "${branch}". Pass allowProtected: true to override (only after explicit user confirmation).`
    );
    this.name = "ProtectedBranchError";
  }
};
async function deleteLocalBranch(args) {
  if (PROTECTED_BRANCHES.has(args.branch) && !args.allowProtected) {
    throw new ProtectedBranchError(args.branch);
  }
  const flag = args.force ? "-D" : "-d";
  await exec2(`git branch ${flag} ${shq(args.branch)}`, {
    cwd: args.cwd
  });
}
async function renameBranch(args) {
  await exec2(`git branch -m ${shq(args.newName)}`, { cwd: args.cwd });
}
async function mergeBranch(args) {
  await exec2(`git merge ${shq(args.branch)}`, { cwd: args.cwd });
}
async function createTag(args) {
  const parts = ["git", "tag"];
  if (args.message) parts.push("-a");
  parts.push(shq(args.name));
  if (args.message) parts.push("-m", shq(args.message));
  if (args.sha) parts.push(shq(args.sha));
  await exec2(parts.join(" "), { cwd: args.cwd });
}
async function deleteTag(args) {
  await exec2(`git tag -d ${shq(args.name)}`, { cwd: args.cwd });
}
async function deleteRemoteTag(args) {
  const remote = args.remote ?? "origin";
  await exec2(`git push ${remote} --delete ${shq(`refs/tags/${args.name}`)}`, {
    cwd: args.cwd
  });
}

// scripts/git/stash.ts
init_esm_shims();
function maybeMessageFlag(message) {
  return message ? ` -m ${shq(message)}` : "";
}
async function stash(args) {
  await exec2(`git stash push${maybeMessageFlag(args.message)}`, {
    cwd: args.cwd
  });
}
async function stashStaged(args) {
  await exec2(`git stash push --staged${maybeMessageFlag(args.message)}`, {
    cwd: args.cwd
  });
}
async function stashIncludeUntracked(args) {
  await exec2(
    `git stash push --include-untracked${maybeMessageFlag(args.message)}`,
    { cwd: args.cwd }
  );
}
async function stashList(args) {
  try {
    const raw = await exec2("git stash list", { cwd: args.cwd });
    return raw ? raw.split("\n").filter(Boolean) : [];
  } catch {
    return [];
  }
}
async function stashApply(args) {
  const index = args.index ?? 0;
  await exec2(`git stash apply stash@{${index}}`, { cwd: args.cwd });
}
async function stashPop(args) {
  await exec2("git stash pop", { cwd: args.cwd });
}
async function stashDrop(args) {
  const index = args.index ?? 0;
  await exec2(`git stash drop stash@{${index}}`, { cwd: args.cwd });
}
async function stashDropAll(args) {
  await exec2("git stash clear", { cwd: args.cwd });
}

// scripts/git/rebase.ts
init_esm_shims();
import * as fs32 from "fs";
import * as path32 from "path";
async function abortRebase(args) {
  await exec2("git rebase --abort", { cwd: args.cwd });
}
async function isRebasing(args) {
  try {
    return fs32.existsSync(path32.join(args.cwd, ".git/rebase-merge")) || fs32.existsSync(path32.join(args.cwd, ".git/rebase-apply"));
  } catch {
    return false;
  }
}
async function rebaseBranch(args) {
  await exec2(`git rebase ${shq(args.branch)}`, { cwd: args.cwd });
}
async function pullRebase(args) {
  await exec2("git pull --rebase", { cwd: args.cwd });
}

// scripts/git/worktree.ts
init_esm_shims();
async function createWorktree(args) {
  await exec2(
    `git worktree add ${shq(args.path)} -b ${shq(args.branch)}`,
    { cwd: args.cwd }
  );
}
async function listWorktrees(args) {
  try {
    const raw = await exec2("git worktree list", { cwd: args.cwd });
    return raw ? raw.split("\n").filter(Boolean) : [];
  } catch {
    return [];
  }
}
async function removeWorktree(args) {
  await exec2(`git worktree remove ${shq(args.path)}`, { cwd: args.cwd });
}

// scripts/git/log.ts
init_esm_shims();
async function getLogRaw(args) {
  try {
    return await exec2(
      `git log --date-order --format=${shq(args.format)} -${args.limit}${args.refArgs}`,
      { cwd: args.cwd }
    );
  } catch {
    return "";
  }
}
async function getLogShortstat(args) {
  try {
    return await exec2(
      `git log --date-order --format=${shq(args.format)} --shortstat -${args.limit}${args.refArgs}`,
      { cwd: args.cwd }
    );
  } catch {
    return "";
  }
}
async function getOutgoingCommits(args) {
  try {
    const raw = await exec2("git log --oneline @{u}..HEAD", { cwd: args.cwd });
    return raw.split("\n").filter(Boolean).map((l) => l.split(" ")[0]);
  } catch {
    return [];
  }
}
async function getIncomingCommits(args) {
  try {
    const raw = await exec2("git log --oneline HEAD..@{u}", { cwd: args.cwd });
    return raw.split("\n").filter(Boolean).map((l) => l.split(" ")[0]);
  } catch {
    return [];
  }
}
async function getRecentMerges(args) {
  const limit = args.limit ?? 5;
  try {
    const raw = await exec2(`git log --merges --oneline -${limit}`, {
      cwd: args.cwd
    });
    return raw.split("\n").filter(Boolean).map((line) => {
      const sp = line.indexOf(" ");
      return { sha: line.substring(0, sp), message: line.substring(sp + 1) };
    });
  } catch {
    return [];
  }
}
async function getBranchesAtCommit(args) {
  try {
    const raw = await exec2(
      `git branch -a --points-at ${shq(args.sha)} --format=${shq("%(refname:short)")}`,
      { cwd: args.cwd }
    );
    return raw.trim().split("\n").filter(Boolean).filter((b) => !b.includes("HEAD") && b !== "origin");
  } catch {
    return [];
  }
}
async function getCommitFiles(args) {
  try {
    let raw = await exec2(
      `git diff-tree --no-commit-id --name-status -r ${shq(args.sha)}`,
      { cwd: args.cwd }
    );
    if (!raw.trim()) {
      try {
        raw = await exec2(
          `git diff --name-status ${shq(`${args.sha}^1`)} ${shq(args.sha)}`,
          { cwd: args.cwd }
        );
      } catch {
        return [];
      }
    }
    return raw.split("\n").filter(Boolean).map((line) => {
      const parts = line.split("	");
      return { status: parts[0][0], path: parts[parts.length - 1] };
    });
  } catch {
    return [];
  }
}
async function getDiffFiles(args) {
  try {
    const cmd = args.toRef ? `git diff --name-status ${shq(args.fromRef)} ${shq(args.toRef)}` : `git diff --name-status ${shq(args.fromRef)}`;
    const raw = await exec2(cmd, { cwd: args.cwd });
    return raw.split("\n").filter(Boolean).map((line) => {
      const parts = line.split("	");
      return { status: parts[0][0], path: parts[parts.length - 1] };
    });
  } catch {
    return [];
  }
}

// scripts/git/mutation.ts
init_esm_shims();
async function checkoutBranch(args) {
  const flag = args.create ? "-b " : "";
  const sp = args.startPoint ? ` ${shq(args.startPoint)}` : "";
  await exec2(`git checkout ${flag}${shq(args.branch)}${sp}`, {
    cwd: args.cwd
  });
}
async function checkoutDetached(args) {
  await exec2(`git checkout --detach ${shq(args.sha)}`, { cwd: args.cwd });
}
async function revert(args) {
  const parents = (await exec2(`git rev-parse ${shq(`${args.sha}^@`)}`, { cwd: args.cwd })).trim().split("\n").filter(Boolean);
  const mFlag = parents.length > 1 ? " -m 1" : "";
  await exec2(`git revert --no-edit${mFlag} ${shq(args.sha)}`, {
    cwd: args.cwd
  });
}
async function cherryPick(args) {
  await exec2(`git cherry-pick ${shq(args.sha)}`, { cwd: args.cwd });
}

// scripts/util/index.ts
init_esm_shims();

// scripts/util/cli-entry.ts
init_esm_shims();
import { realpathSync } from "fs";
import { fileURLToPath as fileURLToPath7 } from "url";
function isCliEntry(importMetaUrl) {
  const invokedRaw = process.argv[1];
  if (!invokedRaw) return false;
  let invokedResolved;
  let moduleResolved;
  try {
    invokedResolved = realpathSync(invokedRaw);
  } catch {
    return false;
  }
  try {
    moduleResolved = realpathSync(fileURLToPath7(importMetaUrl));
  } catch {
    return false;
  }
  return invokedResolved === moduleResolved;
}

// scripts/util/proxy-env.ts
init_esm_shims();
var PROXY_ENV_KEYS = [
  "HTTP_PROXY",
  "HTTPS_PROXY",
  "NO_PROXY",
  "http_proxy",
  "https_proxy",
  "no_proxy",
  "npm_config_proxy",
  "npm_config_https_proxy",
  "npm_config_no_proxy",
  "npm_config_registry"
];
function proxyEnvSubset(source = process.env) {
  const out = {};
  for (const key of PROXY_ENV_KEYS) {
    const v = source[key];
    if (v !== void 0 && v !== "") {
      out[key] = v;
    }
  }
  return out;
}
function withProxyEnv(base = {}) {
  const out = {};
  const inherited = proxyEnvSubset();
  for (const [k, v] of Object.entries(inherited)) {
    out[k] = v;
  }
  for (const [k, v] of Object.entries(base)) {
    if (v !== void 0) out[k] = v;
  }
  return out;
}
export {
  CONVENTION_TIER_DEFAULTS,
  DEFAULT_PROTECTED_TIER_NAMES,
  FIXABLE_FINDING_IDS,
  GITHUB_SCOPES,
  GitHubPullRequestError,
  GitHubRepoError,
  GitHubRunnerError,
  GitHubSecretsError,
  InitializrNetworkError,
  InitializrParseError,
  LAKEBASE_BRANCH_NAME_MAX,
  LakebaseBranchError,
  LakebaseBranchTtlTooLongError,
  LakebaseProjectError,
  MIGRATION_DEFAULTS,
  NODE_E2E_TEMPLATE_FILES,
  PLAYWRIGHT_TEMPLATE_FILES,
  PLAYWRIGHT_TEST_VERSION_RANGE,
  PROXY_ENV_KEYS,
  PYTEST_BDD_VERSION_RANGE,
  PYTEST_PLAYWRIGHT_VERSION_RANGE,
  PYTHON_E2E_TEMPLATE_FILES,
  ProtectedBranchCommitError,
  ProtectedBranchError,
  SCM_STATES,
  STATE_FILE_REL,
  SchemaMigrationError,
  ScmAbandonError,
  ScmAdoptError,
  ScmClaimError,
  ScmDoctorFixError,
  ScmMergeError,
  ScmPreparePrError,
  ScmRecoverError,
  ScmWaitCiError,
  SpringInitializrClient,
  WorkflowScopeError,
  _testMakeBrownfieldFixture,
  abandonFeatureBranch,
  abortRebase,
  addE2eToRunTestsScript,
  addInfraToPackageJson,
  addInfraToRunTestsScript,
  addPlaywrightToPackageJson,
  addRemote,
  adoptLakebaseProject,
  adoptScmState,
  applySchemaMigrations,
  assertAdoptionPreflight,
  assertCleanForFork,
  assertCommitTargetNotProtected,
  buildSchemaQuery,
  cacheProjectRetention,
  catalogExists,
  catalogExplorerUrl,
  checkDatabricksAuth,
  checkoutBranch,
  checkoutDetached,
  checkoutPaired,
  cherryPick,
  claimFeatureBranch,
  clearRetentionCache,
  cloneRepo,
  commit,
  commitAll,
  commitAllIfChanged,
  commitAllSignedOff,
  commitAmend,
  commitAndPush,
  commitSignedOff,
  compileMigrationPattern,
  connectionApplicationName,
  copyDirSubstituted,
  createBranch,
  createFeaturePairedBranch,
  createLakebaseProject,
  createLongRunningBranch,
  createPairedBranch,
  createPerfPairedBranch,
  createProject,
  createPullRequest,
  createRegistrationToken,
  createRepo,
  createTag,
  createTestPairedBranch,
  createUatPairedBranch,
  createWorktree,
  cutBackup,
  databricksAuthPrereqMessage,
  delay,
  deleteAppEndpoint,
  deleteBranch,
  deleteLakebaseProject,
  deleteLocalBranch,
  deletePairedBranch,
  deleteRemoteBranch,
  deleteRemoteTag,
  deleteRepo,
  deleteRunner,
  deleteTag,
  deployClaudeAgents,
  deployClaudeCommands,
  deployClaudeSkills,
  deployClientProject,
  deployDeployTargets,
  deployEnv,
  deployEnvExample,
  deployGitignore,
  deployLanguageProject,
  deployScripts,
  deploySpringStarter,
  deployVscodeSettings,
  deployWorkflows,
  deriveCiAppName,
  describeGates,
  detectCommandDrift,
  detectLanguage,
  detectLanguageAt,
  detectScaffoldedDrift,
  detectWorkflowDrift,
  diagnoseGitHubAuth,
  dirIsEmpty,
  discardAllChanges,
  enableE2eForProject,
  enableInfraForProject,
  endpointPath,
  ensureAppEndpoint,
  ensureCachedArchive,
  ensureEndpoint,
  ensureLakebaseSecretAuth,
  ensureProfilePinned,
  ensurePythonBddDeps,
  ensurePythonE2eDeps,
  ensureSchemaAndVolume,
  exec2 as exec,
  extractPullNumber,
  extractZipToDir,
  fastForwardBranch,
  featureBranchName,
  fetch2 as fetch,
  findDefaultBranchName,
  findHistoryRetentionDuration,
  fixFinding,
  formatJUnit,
  formatOwnerRepo,
  formatSchemaDiffAsMarkdown,
  generateAppYaml,
  getActionsEnabled,
  getAheadBehind,
  getAppEndpoint,
  getAppServicePrincipal,
  getBranchByName,
  getBranchesAtCommit,
  getCachedProjectRetention,
  getCiAppEndpoint,
  getCommitFiles,
  getConnection,
  getCredential,
  getCurrentBranch,
  getCurrentUser,
  getDefaultBranch,
  getDefaultBranchId,
  getDefaultBranchName,
  getDiffFiles,
  getEndpoint,
  getFileAtRef,
  getGitHubUrl,
  getIncomingCommits,
  getLogRaw,
  getLogShortstat,
  getMergeBase,
  getNearestParentName,
  getOutgoingCommits,
  getOwnerRepo,
  getProjectInfo,
  getProjectRetentionDuration,
  getPullRequest,
  getPullRequestComments,
  getPullRequestFiles,
  getPullRequestReviews,
  getRecentMerges,
  getRepoFullName,
  getRepoRoot,
  getRunnerIdByName,
  getRunnerInfo,
  getRunnerStatus,
  getSchemaDiff,
  getTargetNames,
  gitBranchExists,
  gitInit,
  grantLakebasePermission,
  grantUcCatalogPermission,
  hasRemoteBranch,
  hasUpstream,
  inferTierTopology,
  initWorkflowState,
  installHooks,
  installPlaywright,
  isAllSchemas,
  isCliEntry,
  isDirty,
  isForeignFeatureClaim,
  isLongRunningTierBranch,
  isLtsJavaVersion,
  isPrereleaseBootVersion,
  isRebasing,
  isRunning,
  isTier,
  isTtlTooLongError,
  kitWarmWarning,
  listAppDeployments,
  listBranches,
  listIssueComments,
  listLocalBranches,
  listMigrationsOnBranch,
  listRemoteBranches,
  listRemotes,
  listRepoRunners,
  listSchemaMigrations,
  listSecretNames,
  listTags,
  listWorkflowRuns,
  listWorktrees,
  mergeBranch,
  mergeFeature,
  mergePaired,
  mergePairedPullRequest,
  mergePullRequest,
  minLakebaseTtl,
  mintCredential,
  normalizeHost,
  normalizeTierName,
  parseHostFromAuthDescribe,
  parseLakebaseTtl,
  parseOwnerRepo,
  parseTargetsYaml,
  patchPomForLakebase,
  patchWorkflowsForRunnerType,
  pollUntil,
  pollUntilDefined,
  preparePr,
  projectPath,
  propagateCredentials,
  protectedTierNamesFromEnv,
  proxyEnvSubset,
  publishBranch,
  pull,
  pullFrom,
  pullRebase,
  push,
  pushCurrentBranchForPr,
  pushFailureHint,
  pushTo,
  queryBranchSchema,
  queryBranchTables,
  readEnvVar,
  readTargets,
  readWorkflowState,
  rebaseBranch,
  recoverOrphans,
  release,
  removeRemote,
  removeRunner,
  removeWorktree,
  renameBranch,
  repoExists,
  resolveBranchId,
  resolveBranchPath,
  resolveCurrentUser,
  resolveDatabricksHost,
  resolveDefaultBranch,
  resolveEndpointHost,
  resolveFeatureStartPoint,
  resolveGitHubToken,
  resolveJavaHome,
  resolveLatestBootVersion,
  resolveLatestLtsJavaVersion,
  resolveMigrationLanguage,
  resolveMigrationLayout,
  resolveNearestParent,
  resolveParentBranch,
  resolveProfileForHost,
  resolveProfileForHostSync,
  resolveProtectedTierNames,
  revert,
  rollbackDeploy,
  rollbackSchemaMigration,
  runDoctor,
  runDoctor2 as runHealthDoctor,
  runInfraSuite,
  runPlaywrightInstall,
  runnerDir,
  runnerName,
  sanitizeArtifactId,
  sanitizeBranchName,
  sanitizeFeatureSlug,
  scaffoldAll,
  scaffoldStaticAll,
  schemaMigrationStatus,
  schemaObjectName,
  selectProfileForHost,
  setRepoSecret,
  setRepoSecrets,
  setupRunner,
  shq,
  stash,
  stashApply,
  stashDrop,
  stashDropAll,
  stashIncludeUntracked,
  stashList,
  stashPop,
  stashStaged,
  stateFilePath,
  stopRunner,
  substrateVersion,
  sync,
  syncCiSecrets,
  syncEnvToCurrentBranch,
  tierBranchNames,
  toolForLanguage,
  tryCreateCatalog,
  tryGhAuthToken,
  tryVsCodeSession,
  undoLastCommit,
  updateEnvConnection,
  updateWorkflows,
  uploadDirectory,
  validateApp,
  validateCreateInputs,
  validateWorkflowState,
  verifyHooks,
  verifyProject,
  verifyWorkflows,
  waitForBranchAuthReady,
  waitForBranchReady,
  waitForCi,
  warmAndVerifyKit,
  withLakebaseRollback,
  withProxyEnv,
  workflowStateFileExists,
  writeEnvFile,
  writePlaywrightTemplates,
  writeTargets,
  writeWorkflowState
};
/*! Bundled license information:

toad-cache/dist/toad-cache.mjs:
  (**
   * toad-cache
   *
   * @copyright 2026 Igor Savin <kibertoad@gmail.com>
   * @license MIT
   * @version 3.7.3
   *)
*/
//# sourceMappingURL=index.js.map