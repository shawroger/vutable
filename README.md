# Vutable

---

`vutable` 是一个高效便利的 `CSV文件转网页`的开源工具，支持自定义配置，支持各种检索模式，使用简单方便。

`vutable` 是一个开源的项目，其使用了如下的开源项目

- [vuejs](https://vuejs.org/)

- [axios](https://github.com/axios/axios)

- [rexine](https://github.com/shawroger/Rexine)

- [element-ui](https://github.com/ElemeFE/element)

## 快速开始

```bash
git clone https://github.com/shawroger/vutable.git
```

或者直接在一个目录准备一个`data.csv`和`index.html`文件，并在`index.html`中加入如下内容

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="viewport" content="width=device-width,initial-scale=1.0" />
		<title>Vutable Demo</title>
		<link rel="stylesheet" href="//unpkg.com/vutable/dist/main.css" />
	</head>
	<body>
		<div id="app"></div>
		<script>
			window.$vutable = {
				index: true, // 使用序号
				footer: true, //显示页脚
				target: "#app", //渲染 div 的 id
				csv: "./data.csv", // 读取的文件路径
				title: "Vutable Demo", // 标题
				/*
					label: [], // 每一列的标题
					useCols: [], // 控制显示列数
					searchMode: [], // 每一列的检索方式

					beforeInit() {}, // 函数钩子 - 读取文件完成时
					onload() {}, // 函数钩子 - 渲染完成时
					onchange() {}, // 函数钩子 - 检索变动时
				*/
			};
		</script>
		<script src="//unpkg.com/vutable/dist/main.js"></script>
	</body>
</html>
```

### 修改文件

默认的读取的`CSV`文件路径

- 开发模式 `/public/data.csv`

- 部署模式 `/data.csv`

```csv
张三,20,北京
李四,25,上海
```

### 本地运行

```bash
npm run serve
```

### 打包部署

```bash
npm run build
```

## 全局配置

修改 index.html 文件

```html
<script>
	window.$vutable = {
		index: true,
		footer: true,
		target: "#app",
		csv: "./data.csv",
		title: "Vutable Demo",
		/*
			label: [],
			useCols: [],
			searchMode: [],

			beforeInit() {},
			onload() {},
			onchange() {},
		*/
	};
</script>
```

其中 `$vutable` 即为全局配置设置，目前有 7 项可设置属性，3 个函数钩子可供配置。

### title

```ts
title: string;
```

`title` 是数据表的标题，如果不设置的话，默认为网页的标题 `document.title`

### label

```ts
label: Array<string>
```

`label` 是数据表每一列的标题，如果不配置的话，默认读取 `CSV` 文件的第 1 行。

```html
<script>
	window.$vutable = {
		// ...more configs
		label: ["姓名", "年龄", "住址"],
	};
</script>
```

`vutable`即会渲染三列分别为`姓名, 年龄, 住址`的数据表

### index

```ts
index: boolean;
```

如果想要额外渲染一行序号，可以在配置`index`为成员前加上`true`，默认为`false`不显示序号

```html
<script>
	window.$vutable = {
		// ...more configs
		index: true,
	};
</script>
```

### useCols

```ts
useCols: Array<number>
```

如果想忽略某一列的渲染，可以在配置`useCols`项，以`CSV`文件内的第一列为 0 依次向右递增，设置在`useCols`项的列的序号将被渲染，如果不设置或设置为空数组，将渲染所有列。

```html
<script>
	window.$vutable = {
		// ...more configs
		useCols: [0, 1, 2, 4], // 序号为 3 的列将被忽略
	};
</script>
```

### searchMode

```ts
searchMode: Array<
	null |  // 不检索
	string |  // 字符匹配模式 | 字符全等模式
	boolean | // 排序模式
	Array<string> | // 列表匹配模式
	Array<{ key: string; val: string }> //同上
>
```

`searchMode` 规定了数据表每一列的检索方式，如果不设置的话，默认不开启检索模式。

`searchMode`的配置项看似复杂，不过都是以`CSV`文件内的第一列为 0 依次向右递增配置检索模式，且每种检索方式只对应一种描述，所以操作起来并不困难。

#### 不检索模式

```html
<script>
	window.$vutable = {
		// ...more configs
		searchMode: [null, null, null],
	};
</script>
```

将某一列设置为`null`，该列就不会开启检索功能。

#### 字符匹配模式

```html
<script>
	window.$vutable = {
		// ...more configs
		searchMode: ["", "", "null"],
	};
</script>
```

将某一列设置为`字符串`格式，该列就会开启字符匹配检索模式，即该列元素包含检索内容为符合条件，这也是默认配置。

#### 字符全等模式

```html
<script>
	window.$vutable = {
		// ...more configs
		searchMode: [
			"", // 字符匹配模式
			"[=]", // 字符全等模式
			"null",
		],
	};
</script>
```

将某一列设置为`字符串`格式且值为`[=]`，该列就会开启字符全等检索模式，即该列元素全等于检索内容为符合条件。

#### 排序模式

```html
<script>
	window.$vutable = {
		// ...more configs
		searchMode: ["", true, "null"],
	};
</script>
```

将某一列设置为`boolean`类型，该列就会开启排序模式，即该列元素会按照`sort`顺序排列，且初始排序方向与设置的`boolean`类型值相同。

#### 列表匹配模式

```html
<script>
	window.$vutable = {
		title: "VUE TABLE DEMO",
		config: {
			label: ["[#]姓名", "年龄", "住址"],
			searchMode: ["", true, "null"],
		},
	};
</script>
```

将某一列设置为`Array<string>`或者`Array<{ key: string; val: string }>`类型，该列就会列表匹配模式，`vutable`会渲染出一个下拉列表进行检索。

> 如何配置下拉列表

如果您的列表显示内容和检索内容相同 ，直接在该列配置一项字符串数组即可。

```html
<script>
	window.$vutable = {
		title: "VUE TABLE DEMO",
		config: {
			label: ["[#]姓名", "年龄", "住址"],
			searchMode: ["", true, ["北京", "上海", "广州"]],
		},
	};
</script>
```

如果您的列表显示内容和检索内容不相同，则该列配置`包含对象key和val的数组`即可。

```html
<script>
	window.$vutable = {
		title: "VUE TABLE DEMO",
		config: {
			label: ["[#]姓名", "年龄", "住址"],
			searchMode: [
				"",
				true,
			[
				{ val: "BJ", key:"北京" },
				{ val: "SH", key:"上海" },
				{ val: "GZ", key: "广州" }
			]
		},
	};
</script>
```

## 钩子函数

### beforeInit

`beforeInit`函数钩子在读取文件完成时调用，第一个参数为读取到的文件的内容。

### onload

`onload`函数钩子在渲染完成时调用，第一个参数为[hooks](./#hooks)。

### onChange

`onChange`函数钩子在检索变动时(如切换检索、输入改变、换页翻页)调用，第一个参数为[hooks](./#hooks)。

## 其他配置

### csv

```ts
csv: string;
```

配置项`csv`为`vutable`读取的`CSV`文件的路径，默认为`./data.csv`(相对于`index.html`的路径)，可以为远程资源。

### target

```ts
footer: string;
```

选择要渲染的 DIV 的 id，默认为`#vutable`标记。

### footer

```ts
footer: boolean;
```

控制是否显示默认页脚，默认为`true`，即显示页脚。

### 只读项 · hooks

`hooks`是`vutable`暴露在全局的一个对象，包含了以下内容：

```js
{
	root, // 即为 window.$vutable
		width, // 页面宽度
		pageSize, // 总页数
		tableData, // 转换后的数据
		searchMode, // 所有已配置的检索模式
		originData, // 原始文件内容
		currentType, // 当前的检索模式
		currentPage; // 当前页数
}
```
