/**
 * smart-copy
 * =============
 *
 * Предоставляет технологию для копирования набора собранных файлов в другую директорию
 *
 * Все необходимые целевые директории создаются
 *
 * **Опции**
 *
 * * *String* **sourceTargets** — Список файлов для копирования. Обязательная опция.
 * * *String* **dest** — Директория в которую будут скопированы файлы. Обязательная опция.
 * * *String* **target** — Таргет. Обязательная опция.
 * * *String* **lang** — Язык для которого необходимо произвести копирование, `{lang}` для копирования всех языков.
 *
 * **Пример**
 *
 * ```javascript
 * nodeConfig.addTech([ require('enb-smart-copy/techs/smart-copy'), { sourceTargets: ['_?.css', '_?.ie9.css'], dest: '../out/public', target: 'public' } ]);
 * nodeConfig.addTech([ require('enb-smart-copy/techs/smart-copy'), { sourceTargets: ['_?.{lang}.js'], dest: '../out/public', target: 'i18n-public.{lang}', lang: '{lang}' } ]);
 * ```
 */

var enb = require('enb');
var path = require('path');
var vow = require('vow');
var vfs = enb.asyncFS || require('enb/lib/fs/async-fs');
var buildFlow = enb.buildFlow || require('enb/lib/build-flow');

module.exports = buildFlow.create()
	.name('smart-copy')
	.target('target')
	.defineRequiredOption('sourceTargets')
	.defineRequiredOption('dest')
	.defineRequiredOption('target')
	.defineOption('lang')
	.useSourceListFilenames('sourceTargets')
	.builder(function (files) {
		var self = this;
		var destDir = path.join(this.getOption('dest'), this.node.getPath());

		return vfs.makeDir(destDir)
			.then(function () {
				return vow.all(files.map(function (file) {
					return vfs.copy(file, path.join(destDir, path.basename(file)));
				}));
			})
			.then(function () {
				files.map(function (file) {
					return path.basename(file);
				}).forEach(function (file) {
					self.node.getLogger().logAction('rebuild', file + ' → ' + destDir + '/', self.getName());
				})
			})
			.fail(function (err) {
				self.node.getLogger().logErrorAction('fail', err.stack, self.getName());
			});
	})
	.methods({
		clean: function () {
			var self = this;
			var destDir = path.join(this.getOption('dest'), this.node.getPath());

			return vfs.removeDir(destDir)
				.then(function () {
					self.node.getLogger().logClean(destDir);
				})
				.fail(function (err) {
					// Пропускаем ошибки типа ENOENT — удаление уже удаленной папки
					if (err.code !== 'ENOENT') {
						self.node.getLogger().logErrorAction('fail', err.stack, self.getName());
					}
				});
		}
	})
	.createTech();
