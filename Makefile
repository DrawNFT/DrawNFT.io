install:
	pnpm install

build:
	pnpm run build

coverage:
	pnpm run coverage

run:
	pnpm run dev

eslint:
	pnpm run eslint

format:
	pnpm run format

lint:
	pnpm run lint

start:
	pnpm run start

testit:
	pnpm run test
	truffle test