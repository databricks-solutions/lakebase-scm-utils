.PHONY: install test migrate run

install:
	dotnet restore App.sln

test:
	dotnet test App.sln

migrate:
	./scripts/flyway-migrate.sh

run:
	dotnet run --project src/App -- --urls "http://127.0.0.1:$${PORT:-8000}"
