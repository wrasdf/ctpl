build:
	docker build -t ctpl:latest .

push-%: build
	docker tag ntpl:latest ikerry/ctpl:v$(*)
	docker tag ntpl:latest ikerry/ctpl:latest
	docker push ikerry/ctpl:v$(*)
	docker push ikerry/ctpl:latest

sh: build
	docker run -it -w /app -v $(shell pwd):/app -v $(HOME)/.aws:/root/.aws --entrypoint "/bin/bash" ctpl:latest
