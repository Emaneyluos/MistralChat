# MistralChat

MistralChat is a web application thanks to we can communicate with the API of MistralAI.

The skeleton is a  [Docker](https://www.docker.com/)-based installer and runtime for the [Symfony](https://symfony.com) web framework,
with [FrankenPHP](https://frankenphp.dev) and [Caddy](https://caddyserver.com/) inside!

Check it out! [Symfony Docker](https://github.com/dunglas/symfony-docker)


TODO: Upgrade with Le Cahier README + env.local

## Getting Started

1. If not already done, [install Docker Compose](https://docs.docker.com/compose/install/) (v2.10+)
2. Run `docker compose build --no-cache` to build fresh images
3. Run `docker compose up --pull always -d --wait` to start the project
4. Run `make composer c=install` to init composer
5. Run `make sf c=importmap:install` to install vendor
6. In prod environment run `make sf c=asset-map:compile`
7. Add in **.env.local** MISTRAL_API_KEY=your_api_key
4. Open `https://localhost` in your favorite web browser and [accept the auto-generated TLS certificate](https://stackoverflow.com/a/15076602/1352334)

**Enjoy!**

## Docs Symfony Docker

1. [Build options](docs/build.md)
2. [Using Symfony Docker with an existing project](docs/existing-project.md)
3. [Support for extra services](docs/extra-services.md)
4. [Deploying in production](docs/production.md)
5. [Debugging with Xdebug](docs/xdebug.md)
6. [TLS Certificates](docs/tls.md)
7. [Using a Makefile](docs/makefile.md)
8. [Troubleshooting](docs/troubleshooting.md)
9. [Updating the template](docs/updating.md)

## License

MistralChat is available under the MIT License.

## Credits

Created by [Souleymane Bah](https://github.com/Emaneyluos)