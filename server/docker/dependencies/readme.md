# Dependencies

We are using ELK stack with Jaeger. So first start the elastic search instance by executing `docker-compose --file {docker-compose-filename} up -d elasticsearch` and then after 2-3 seconds start rest of the dependencies by executing `docker-compose --file {docker-compose-filename} up -d`.

## Link(s)

- https://github.com/jaegertracing/jaeger/issues/931
