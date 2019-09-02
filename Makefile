build:
	docker build -t ctpl:latest .

push-%: build
	docker tag ctpl:latest ikerry/ctpl:$(*)
	docker tag ctpl:latest ikerry/ctpl:latest
	docker push ikerry/ctpl:$(*)
	docker push ikerry/ctpl:latest

sh:
	@docker-compose build sh
	@docker-compose run --rm sh

test:
	@docker-compose build test
	@docker-compose run --rm test
