#mocha-js-ut-tutorial

[TOC]

[Mocha](http://mochajs.org/) 是一种有丰富特性的Javascript测试框架，可以运行于Nodejs和浏览器环境中。 本文是使用Mocha进行Javascript单元测试的入门教程。

Mocha的特点有：

1. 既可以测试简单的JavaScript函数，又可以测试异步代码，因为异步是JavaScript的特性之一；
2. 可以自动运行所有测试，也可以只运行特定的测试；
3. 支持before、after、beforeEach和afterEach来编写初始化代码。

在本文中，我们将所有相关代码及文档放在文件夹`mocha-js-ut-tutorial`中，在文中，该文件夹目录亦称之为根目录或用`/`表示。

##Mocha初体验

###安装Mocha

在安装Mocha前，请确认根目录中存在`package.json`文件。手动创建或`npm init`均可。

```
npm install --save-dev mocha
```

一般我们只在开发阶段才会对代码进行单例测试，因此Mocha只需要在开发阶段中使用，将其安装到DevDependencies中即可。有些教程中会建议把Mocha安装到全局（-g）中，私以为没有必要。正式打包发布时，devDependencies的包不会被包含进来。

###Hello World

1.在根目录创建`hello-world.test.js`

```
const assert = require('assert');

describe('hello world', () => {
  it('should pass the test', () => {
    assert.strictEqual(0, 0);
    assert.strictEqual(true, true);
  });
});
```

2.然后在命令行中运行`node_modules/mocha/bin/mocha hello-world.test.js`，你将看到以下结果：

> $ node_modules/mocha/bin/mocha hello-world.test.js --reporter spec
>
> hello world
>   √ should pass the test
>
> 1 passing (6ms)

可以看到，基础用法是在mocha命令后面紧跟测试脚本的路径和文件名，可以指定多个测试脚本：`$ mocha file1 file2 file3`。

如果在上述步骤中遇到错误，请参考本文后续章节[ES6](#es6)。

##使用Mocha对Javascript模块进行单元测试

在上一节中，我们通过一个hello-world程序对Mocha有了最初的认识，然而与在实际项目中的使用情况还有些差距。接下来我们将模拟一个实际项目并使用Mocha对其进行测试。

###编写待测试模块源码

1.在根目录创建`src`目录
2.创建`add.js`

```
module.exports = (a, b) => a + b;
```

3.创建`minus.js`

```
module.exports = (a, b) => a - b;
```

###编写模块化测试代码

对Javascript模块进行单元测试时，我们一般会创建`test`目录，并将所有测试文件放在`test`目录中。Mocha默认运行`test`目录下的测试文件，这样在执行测试命令`mocha`时就不需要加上`待测试文件名称`了。另外，在编写测试代码时，一般测试代码与源代码模块一一对应。

1.在根目录创建`test`目录
2.创建`add.test.js`

```
const assert = require('assert');
const add = require('../src/add');

describe('Test add() function', function() {
  it('should equals to 2 by add 1 to 1', function() {
    assert.strictEqual(add(1, 1), 2);
  });
  it('should equals to 0 by add -1 to 1', function() {
    assert.strictEqual(add(-1, 1), 0);
  });
});
```

3.创建`minus.test.js`。

```
const assert = require('assert');
const minus = require('../src/minus');

describe('Test minus() function', function() {
  it('should equals to 1 by minusing 1 from 2', function() {
    assert.strictEqual(minus(2, 1), 1);
  });
});
```

4.运行命令`node_modules/mocha/bin/mocha`，将看到以下结果：

> $ node_modules/mocha/bin/mocha --reporter spec
> Test add() function
>   √ should equals to 2 by adding 1 to 1
>   √ should equals to 0 by adding -1 to 1

> Test minus() function
>   √ should equals to 1 by minusing 1 from 2

> 3 passing (7ms)

##npm test script

在`package.json`的`scripts`中添加一条`test`命令：

```
{
  ...
  "scripts": {
    "test": "mocha"
  }
  ...
}
```

这样在与命令行中使用`npm test`即可运行Mocha，即使Mocha没有全局安装也可以正常运行。

##断言

Mocha允许使用任意断言库。在前面的例子中，我们使用的是Nodejs内置的`[assert](https://nodejs.org/api/assert.html)`模块。`assert`模块非常简单，它断言一个表达式为true。如果断言失败，就抛出Error。我们还可以使用以下第三方断言库：

1. [chai](http://chaijs.com/)
   强大的断言库，BDD/TDD两种风格均支持，同时支持should/expect/assert三种断言风格。且有强大的插件机制。
2. [should.js](https://github.com/shouldjs/should.js) BDD风格断言库
3. [expect.js](https://github.com/LearnBoost/expect.js) expect()风格断言库
4. [better-assert](https://github.com/visionmedia/better-assert) C-style self-documenting assert()
5. [unexpected](http://unexpected.js.org/) 可扩展的BDD风格断言工具包

##异步测试
##同步测试

##lambdas 箭头函数

在Mocha中使用lambdas箭头函数是让人沮丧的。由于从词法上来说[箭头函数](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)会绑定this的值，因此这样的函数将无法访问Mocha的上下文（Context），如下：

```
describe('my suite', function() {
  it('my test', function() {
    // should set the timeout of this test to 1000 ms; instead will fail
    // 本意是想设定这个测试用例的超时时间为1s，但这里将会报错。timeout是Mocha Context的方法
    this.timeout(1000);
    assert.ok(true);
  });
});
```

如果你不需要使用Mocha Context，你可以正常使用lambdas 箭头函数。然而，如果你使用了lambdas并且有一天你需要访问Mocha Context，重构的难度将会更大。

##HOOKS

HOOKS不好翻译。在默认的BDD风格接口中，Mocha提供了`before()``after()``beforeEach()``afterEach()`四个方法。这些方法可以用来在测试前初始化前置条件或者在测试结束后执行清理工作。

```
describe('hooks', function() {

  before(function() {
    // runs before all tests in this block
  });

  after(function() {
    // runs after all tests in this block
  });

  beforeEach(function() {
    // runs before each test in this block
  });

  afterEach(function() {
    // runs after each test in this block
  });

  // test cases
});

```

测试用例可以写在任意位置（在HOOKS之前、在HOOKS之后、穿插在HOOKS之间）。不论书写位置如何，所有的HOOKS都可以按合理的顺序运行。先执行`before()`（且只执行一次）；然后对每个测试用例先执行`beforeEach`，接下来运行测试用例，再运行`afterEach`；最后所有测试用例测试结束后，执行`after()`（只执行一次）。【猜测】：同一种HOOK可以写多个，多个相同类型的HOOKS的执行顺序由他们定义的相对位置顺序决定。

###HOOKS的描述

HOOk可以指定一个可选的描述，根据这个描述可以更容易地在测试中定位错误。如果HOOK被指定了函数名，在输出中将使用这个函数名（见样例2）。

```
beforeEach(function() {
  // beforeEach hook
});

beforeEach(function namedFun() {
  // beforeEach:namedFun
});

beforeEach('some description', function() {
  // beforeEach:some description
});
```

###ROOT-LEVEL HOOKS

在最外层的`describe()`之外也可以使用HOOKS，因为Mocha Context实现了`describe()`，这样的HOOK就是ROOT-LEVEL HOOK，对于Mocha的`describe`，我们称之为“root suite”。

##待编写（PENDING）的测试用例

```
it('should ...');
```

没有回调函数。Someone should write these test cases eventually.

##单独（EXCLUSIVE）运行部分测试用例

在测试集（suite）或者测试用例（case）后面使用`.only()`既可以在测试时只运行部分suites或cases。其内部级联的suites和cases也会被执行（除非内部还有其他`.only()`）。

```
describe('test', function() {
  describe.only('test this', function() {
    it.only('test this case', function() {

    });

    it('this case will be skipped', function() {

    });
  });

  describe('this suite will be skipped', function() {

  });
});
```

在`>=V3.0.0`中，`.only()`可以使用多次。`.only()`对HOOKS无影响，HOOKS总是可以被执行。

##跳过（INCLUSIVE）部分测试用例

与`.only()`相对应的用法，在suite或case后面使用`.skip()`来跳过（略过）某个测试集或测试用例。被跳过的suite和case将被标为PENDING。

```
describe('Array', function() {
  describe('#indexOf()', function() {
    it.skip('should return -1 unless present', function() {
      // this test will not be run
    });

    it('should return the index when present', function() {
      // this test will be run
    });
  });

  describe.skip('#splice()', function() {
    // this suite will not be run
  });
});
```

**BEST PRACTICE 最佳实践**

> Use .skip() instead of commenting tests out
> 如果不想执行某些测试用例，使用.skip()而不是把它们注释掉

###this.skip()

在运行时也可以使用`this.skip()`来中止跳过测试。场景：有时候测试用例必须在特定环境或配置下运行，且环境和配置不能事先预知，只能在运行时获得。在`before()`HOOK中使用`this.skip()`可以跳过整个suite。

```
it('should only test in the correct environment', function() {
  if (/* check test environment or configuration */) {
    // make assertions
  } else {
    this.skip(); // good
    // do nothing, bad
  }
});
```

**BEST PRACTICES 最佳实践**

> 1. To avoid confusion, do not execute further instructions in a test or hook after calling this.skip().
> 调用this.skip()之后，不要再执行更多指令了。
> 2. Don’t do nothing! A test should make an assertion or use this.skip().
> 不要出现什么语句都没有的逻辑代码块，一个测试用例应该要么做出断言，要么使用this.skip()跳过测试。

##重试（RETRY）

这个功能主要是为端到端(functional tests/Selenium…)的测试设计的，可以对某个测试用例尝试执行多次。不建议在单元测试（unit tests）中使用这个功能。这个功能会重新执行`befreEach()`/`afterEach()`，但不会重复执行`before()`/`after()`。

*仅供参考*：written using Selenium webdriver

```
describe('retries', function() {
  // Retry all tests in this suite up to 4 times
  this.retries(4);

  beforeEach(function () {
    browser.get('http://www.yahoo.com');
  });

  it('should succeed on the 3rd try', function () {
    // Specify this test to only retry up to 2 times
    this.retries(2);
    expect($('.foo').isDisplayed()).to.eventually.be.true;
  });
});
```

##REPORTERS 测试报告

Mocha提供多种风格的测试报告，同时也可以使用第三方的测试报告样式。可以使用参数`--reporter <name>`来指定报告样式。

1. SPEC `--reporter spec` 默认的报告样式

   ![SPEC](http://mochajs.org/images/reporter-spec.png)

   ![SPEC ERROR](http://mochajs.org/images/reporter-spec-fail.png)

2. DOT MATRIX `--reporter dot` 使用一系列的点来表示测试结果。红色的叹号**<span style="color:red;background-color:black;display:inline-block;padding-left:5px;padding-right:5px;">!</span>**表示失败，蓝色的逗号**<span style="color:blue;background-color:black;display:inline-block;padding-left:5px;padding-right:5px;">,</span>**表示待实现（PENDING），黄色的点**<span style="color:yellow;background-color:black;display:inline-block;padding-left:5px;padding-right:5px;">.</span>**表示测试慢，白色的点**<span style="color:white;background-color:black;display:inline-block;padding-left:5px;padding-right:5px;">.</span>**表示成功。如果你喜欢最简洁的输出可以使用这种报告样式。

   ![DOT](http://mochajs.org/images/reporter-dot.png)

3. NYAN `--reporter nyan` 一只猫

   ![NYAN](http://mochajs.org/images/reporter-nyan.png)

4. TAP `--reporter tap` The TAP reporter emits lines for a Test-Anything-Protocol consumer.

   ![TAP](http://mochajs.org/images/reporter-tap.png)

5. LANDING STRIP `--reporter landing` 模仿飞机降落

   ![LANDING](http://mochajs.org/images/reporter-landing.png)

   ![LANDING ERROR](http://mochajs.org/images/reporter-landing-fail.png)

6. LIST `--reporter list` 输出简洁的测试通过或失败的结果，并在最底部输出测试失败的细节。

   ![LIST](http://mochajs.org/images/reporter-list.png)

7. PROGRESS `--reporter progress` 模拟简单的进度条

   ![PROGRESS](http://mochajs.org/images/reporter-progress.png)

8. JSON `--reporter json` 在所有测试结束时输出一个JSON对象（包含所有测试细节）

   ![JSON](http://mochajs.org/images/reporter-json.png)

9. JSON STREAM 实时地按照事件的发生顺序输出以新行（newline）为界定的JSON事件，以start事件开始，然后是各个测试的测试结果，最后是end事件。

   ![JSON STREAM](http://mochajs.org/images/reporter-json-stream.png)

10. MIN `--reporter min` 只输出测试结果汇总，当然也会输出错误和失败。MIN样式和`--watch`搭配在一起使用非常合适，它们可以清空terminal终端并把测试汇总输出在终端的最上方。

   ![MIN](http://mochajs.org/images/reporter-min.png)

11. DOC `--reporter doc` 输出级联的HTML body内容，使用这些内容，可以很容易地生成好看的文档。（Example: [SuperAgent request library](http://visionmedia.github.io/superagent/docs/test.html)）

   ![DOC](http://mochajs.org/images/reporter-doc.png)

12. MARKDOWN `--reporter markdown` 输出Markdown格式的TOC导航和内容。如果你想用测试的输出来作为Github wiki文档，或者放在repository下面让Github来渲染，这种样式是不错的选择。（Example：[Connect](https://github.com/senchalabs/connect/blob/90a725343c2945aaee637e799b1cd11e065b2bff/tests.md)）

13. HTML 目前Mocha支持的唯一一种浏览器报告。

   ![HTML](http://mochajs.org/images/reporter-html.png)

14. UNDOCUMENTED REPORTERS 非正式？

   The “XUnit” reporter is also available. By default, it will output to the console. To write directly to a file, use `--reporter-options output=filename.xml`.

15. 第三方报告生成器

   Mocha allows you to define custom third-party reporters. For more information see the [wiki](https://github.com/mochajs/mocha/wiki/Third-party-reporters). Examples:
   - [TeamCity reporter](https://github.com/travisjeffery/mocha-teamcity-reporter).
   - [mochawesome](https://github.com/adamgruber/mochawesome) 漂亮的HTML格式报告
      安装`npm install --save-dev mochawesome`，运行`mocha --reporter mochawesome`

      ![mochawesome](/article/img/20170928161509_778.jpg)

##THE TEST/ DIRECTORY

Mocha默认在`./test`目录下找`js`和`coffee`文件来执行，因此应该将测试文件放在`test`目录下。

##Mocha命令参数

###--recursive

`mocha`命令默认只执行`test`目录（不包含其子目录）下的测试文件，加上`--recursive`参数可以改变这种行为，从而递归执行`test`及其子孙目录下的测试文件。

##MOCHA.OPTS

Mocha会尝试加载`./test/mocha.opts`文件并使用其中的配置作为运行参数，我们可以把任意命令行参数放在这个文件中。另外，命令行参数优先级高于mocha.opts文件中的参数。如：

```
// mocha.opts
--reporter DOT
--ui bdd
```

`$ mocha --reporter list --growl` 该命令会覆盖mocha.opts中的reporter参数，并且启用[Growl](http://growl.info/)，使用BDD格式接口。

##MORE
参见 [Mocha](http://mochajs.org):

- DYNAMICALLY GENERATING TESTS
- TEST DURATION
- TIMEOUTS
- DIFFS
- INTERFACES
- RUNNING MOCHA IN THE BROWSER
- EDITOR PLUGINS
- EXAMPLES

##参考

[Mocha](http://mochajs.org)
[Chai](http://chaijs.com/)
[测试框架 Mocha 实例教程](http://www.ruanyifeng.com/blog/2015/12/a-mocha-tutorial-of-examples.html) - *阮一峰*
[Javascript教程-Mocha](https://www.liaoxuefeng.com/wiki/001434446689867b27157e896e74d51a89c25cc8b43bdb3000/00147203593334596b366f3fe0b409fbc30ad81a0a91c4a000) - *廖雪峰*
