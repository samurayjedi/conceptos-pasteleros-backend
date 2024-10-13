## About
Backend for the app Conceptos Pasteleros

<div align="center">

<img src="https://github.com/samurayjedi/conceptos-pasteleros-backend/blob/main/readme/app.webp" alt="App">

</div>

## Install

remember create a dababase called "conceptos":

```bash
mysql -u user -p
create database conceptos;
exit
```

and run:

```bash
composer install
npm install
php artisan storage:link
php artisan migrate
```

## Run

```bash
php artisan serve
npx webpack serve
```
