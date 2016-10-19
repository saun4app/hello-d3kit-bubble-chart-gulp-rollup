# hello-d3kit-es6-gulp-rollup

`hello-d3kit-es6-gulp-rollup` provides an example of using the following to display text on the screen:
- `d3.js` (v4)
- `d3kit.js`
- `es6` (`ES2015`)
- `rollup.js`
- `gulp` (**without** `rollup.config.js`)
- `w3css`

#### Example
<a href="https://saun4app.github.io/hello-d3kit-es6-gulp-rollup" target="_blank">
    <img src="https://raw.github.com/saun4app/hello-d3kit-es6-gulp-rollup/master/demo-screen.png"
         alt="Demo screen"/>
</a>

#### Install
```
$ git clone git@github.com:saun4app/hello-d3kit-es6-gulp-rollup.git demo-app
$ cd demo-app/
$ npm install
```

##### Build
```
$ gulp
```
or
```
$ gulp build
```

##### Build uglified version
```
$ gulp ugly
```
The resulting files are in `build` directory.

##### Run on web server
```
$ npm start
```
or
```
$ http-server ./build -p 3020
```
View the page on `http://localhost:3020/`
<a href="https://saun4app.github.io/hello-d3kit-es6-rollup" target="_blank">
    <img src="https://raw.github.com/saun4app/hello-d3kit-es6-gulp-rollup/master/demo-screen.png"
         alt="Demo screen"/>
</a>

#### Credit
The chart is based on Robert Harris's <a href="https://bl.ocks.org/trebor/ccc5bb7da3fcaa73aa7cbee973d6dcb6" target="_blank">Bubble Chart examle</a>.

#### Resources
- https://d3js.org
- https://github.com/jlengstorf/learn-rollup
- https://github.com/mizmaar3/gulp-es6-rollup-boilerplate
- http://rollupjs.org
- https://github.com/rollup/rollup/wiki/Command-Line-Interface
- https://github.com/rollup/rollup/wiki/Build-tools
- http://newbranch.cn/ui-development-with-es6-javascript-riotjs-and-rollupjs-introduction
- https://bl.ocks.org/trebor/ccc5bb7da3fcaa73aa7cbee973d6dcb6
- https://github.com/53seven/d3-svg
- http://www.w3schools.com/w3css
