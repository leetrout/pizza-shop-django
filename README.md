# Django Pizza Shop

This is a sample Django application used during the Django DevOps workshop at
DjangoCon US '24.

This is not meant to be an exceptional example of any given tool usage or
prescriptive of which tools should be used.

- [Django Pizza Shop](#django-pizza-shop)
  - [Resources for learning](#resources-for-learning)
    - [Django](#django)
    - [Docker](#docker)
    - [DevOps](#devops)
    - [Philosophy](#philosophy)
  - [Getting start with this repo](#getting-start-with-this-repo)
    - [Dependencies](#dependencies)
    - [Quick start](#quick-start)

## Resources for learning

### Django

- [The Django Tutorial][django-tut]
- [Django Books][django-books] By Will Vincent
- [Django Cookiecutter][django-cookiecutter]
- [Docker Django Example][docker-django] by [Nick Janetakis][nick]

### Docker

- [Nick Janetakis][nick] a trusted Docker community leader
- [Best Practices Around Prod Ready Web Apps w/ Docker Compose][compose-prod] by
  Nick
- [Dive Into Docker][dive-docker] by Nick

### DevOps

- [What is DevOps][devops-what-aws] by AWS
- [No such thing as a DevOps Team][devops-no-such-thing]

### Philosophy

- [A Philosophy of Software Design][philo] by John Ousterhout
- [Ironies of Automation][auto-irony] by Lisanne Bainbridge
- [Peopleware][peopleware]
- [Volatility-Based Decomposition][volatility]

## Getting start with this repo

### Dependencies

This repo includes a `.tool-versions` file which works with the [asdf][asdf]
version manager.

Install asdf and you can run `./scripts/bootstrap.sh` to get started.

If you are not using asdf you can reference the file for the versions of tools
to install.

### Quick start

Ensure you have a `.env` file (see `.env.sample` if not).

Using SQLite or an empty Postgres:

```shell
./manage.py migrate
./manage.py loaddata apps/pizza_shop/fixtures/*
./manage.py create_sample_orders 2 10
```

Now that you have a database configured with sample orders you can run
the pizza shop simulator to process them:

```shell
./manage.py run_pizza_shop_sim
```

While running the simulator you can open two additional terminals and run
the web stack.

Run the backend:

```shell
./manage.py runserver_plus
```

Run the frontend:

```shell
cd apps/pizza_shop/frontend
npm i
npm run dev
```

Open http://localhost:5173/ and place an order. 🍕

[asdf]: https://asdf-vm.com
[auto-irony]: https://www.complexcognition.co.uk/2021/06/ironies-of-automation.html?lr=1718122232909
[compose-prod]: https://nickjanetakis.com/blog/best-practices-around-production-ready-web-apps-with-docker-compose
[devops-no-such-thing]: https://www.thoughtworks.com/insights/blog/there-no-such-thing-devops-team
[devops-what-aws]: https://aws.amazon.com/devops/what-is-devops/
[dive-docker]: https://diveintodocker.com/
[django-books]: https://wsvincent.com/best-django-books/
[django-cookiecutter]: https://cookiecutter-django.readthedocs.io/en/latest/
[django-tut]: https://docs.djangoproject.com/en/5.1/intro/tutorial01/
[docker-django]: https://github.com/nickjj/docker-django-example
[nick]: https://nickjanetakis.com/
[peopleware]: https://en.wikipedia.org/wiki/Peopleware:_Productive_Projects_and_Teams
[philo]: https://web.stanford.edu/~ouster/cgi-bin/aposd.php
[volatility]: https://www.informit.com/articles/article.aspx?p=2995357&seqNum=2
