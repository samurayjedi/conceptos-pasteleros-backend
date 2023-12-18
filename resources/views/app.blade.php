<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <title inertia>{{ config('app.name', 'Conceptos') }}</title>
  @routes
  <?php
    $appFilePath = public_path().'/js/app.bundle.js';
    $uri = file_exists($appFilePath) ? '/js' : 'http://localhost:3000'; ?>
  <!-- <script defer="defer" src="<?= $uri ?>/vendors-app.bundle.js"></script> -->
  <script defer="defer" src="<?= $uri ?>/app.bundle.js"></script>
  <!-- <script defer="defer" src="<?= $uri ?>/runtime.bundle.js"></script> -->
  @inertiaHead
</head>
<body>
  @inertia
</body>
</html>
