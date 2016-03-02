enb-smart-copy
==============

Предоставляет технологию для копирования набора собранных файлов в другую директорию.

Все необходимые целевые директории создаются технологией.

## Установка
```bash
npm install --save-dev enb-smart-copy
```

## Документация

**Опции**

* *String* **sourceTargets** — Список файлов для копирования. Обязательная опция.
* *String* **dest** — Директория в которую будут скопированы файлы. Обязательная опция.
* *String* **target** — Таргет. Обязательная опция.
* *String* **lang** — Язык для которого необходимо произвести копирование, `{lang}` для копирования всех языков.

**Пример**

```javascript
nodeConfig.addTargets([
	'public',
	'i18n-public.{lang}'
]);

nodeConfig.addTech([require('enb-smart-copy/techs/smart-copy'), {
    sourceTargets: ['_?.css', '_?.ie9.css'],
    dest: '../out/public',
    target: 'public'
}]);

nodeConfig.addTech([require('enb-smart-copy/techs/smart-copy'), {
    sourceTargets: ['_?.{lang}.js'],
    dest: '../out/public',
    target: 'i18n-public.{lang}',
    lang: '{lang}'
}]);
```
