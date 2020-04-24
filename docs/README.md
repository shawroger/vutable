# Vutable

`vutable` 是一个高效便利的 `CSV文件转网页`的开源工具，支持 CSV 行内配置和自定义配置，使用简单方便，支持各种检索模式。

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
				title: "vutable demo docs",
				config: {
					label: [""],
					rowData: [""],
				},
			};
		</script>
		<script src="//unpkg.com/vutable/dist/main.js"></script>
	</body>
</html>
```

### 修改 CSV 文件

默认的读取的`CSV`文件路径

- 开发模式 `/public/data.csv`

- 部署模式 `/data.csv`

```csv
null,null,null
[#]姓名,年龄,住址
张三,20,北京
李四,25,上海
```

### 本地运行

```bash
npm run serve
```

### 打包

```bash
npm run build
```

## 全局 JavaScript 配置

修改 index.html 文件

```html
<script>
	window.$vutable = {
		title: "VUE TABLE DEMO",
		config: {
			// label: [],
			// rowData: []
		},
	};
</script>
```

其中 `$vutable` 即为全局配置设置，目前有 3 项可设置属性，并且都是可选的。

### title

```ts
title?: string
```

`title` 是数据表的标题，如果不设置的话，默认为网页的标题 `document.title`

### config.label

```ts
label?: Array<string>
```

`label` 是数据表每一列的标题，如果不设置的话，默认读取 `CSV` 文件的第 1 行或第 2 行，具体读取行数在第二种配置中介绍。

#### 基本配置

```html
<script>
	window.$vutable = {
		title: "VUE TABLE DEMO",
		config: {
			label: ["姓名", "年龄", "住址"],
			// rowData: []
		},
	};
</script>
```

`vutable`即会渲染三列分别为`姓名, 年龄, 住址`的数据表

#### 增加序号

如果想要额外渲染一行序号，可以在第一个`label`成员前加上`[#]`，即如下所示

```html
<script>
	window.$vutable = {
		title: "VUE TABLE DEMO",
		config: {
			label: ["[#]姓名", "年龄", "住址"],
			// rowData: []
		},
	};
</script>
```

#### 忽略某一列

如果想忽略某一列的渲染，可以在该`label`成员前加上`[X]`，即如下所示

```html
<script>
	window.$vutable = {
		title: "VUE TABLE DEMO",
		config: {
			label: ["[#][X]姓名", "[X]年龄", "住址"],
			// rowData: []
		},
	};
</script>
```

这样一来，只有`序号`和`住址`两列被渲染了。

### config.rowData

```ts
rowData?: Array<null | boolean | string | Array<string | [string,string]>>
```

`rowData` 规定了数据表每一列的检索方式，如果不设置的话，默认读取 CSV 文件的第 1 行，具体读取行数在第二种配置中介绍。

`rowData`的配置项看似复杂，但每种检索方式只对应一种描述，所以操作起来并不困难。

#### 不检索模式

```html
<script>
	window.$vutable = {
		title: "VUE TABLE DEMO",
		config: {
			label: ["[#]姓名", "年龄", "住址"],
			rowData: [null, null, null],
		},
	};
</script>
```

将某一列设置为`null 或 0`，该列就不会开启检索功能。

#### 字符匹配模式

```html
<script>
	window.$vutable = {
		title: "VUE TABLE DEMO",
		config: {
			label: ["[#]姓名", "年龄", "住址"],
			rowData: ["", "", "null"],
		},
	};
</script>
```

将某一列设置为`字符串`格式，该列就会开启字符匹配检索模式，即该列元素包含检索内容为符合条件，这也是默认配置。

#### 字符全等模式

```html
<script>
	window.$vutable = {
		title: "VUE TABLE DEMO",
		config: {
			label: ["[#]姓名", "年龄", "住址"],
			rowData: ["", "[=]", "null"],
		},
	};
</script>
```

将某一列设置为`字符串`格式且值为`[=]`，该列就会开启字符全等检索模式，即该列元素全等于检索内容为符合条件。

#### 排序模式

```html
<script>
	window.$vutable = {
		title: "VUE TABLE DEMO",
		config: {
			label: ["[#]姓名", "年龄", "住址"],
			rowData: ["", true, "null"],
		},
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
			rowData: ["", true, "null"],
		},
	};
</script>
```

将某一列设置为`Array<string | [string,string]>`类型，该列就会列表匹配模式，`vutable`会渲染出一个下拉列表进行检索。

> 如何配置下拉列表

如果您的列表显示内容和检索内容相同 (key == value)，直接在该列配置一项字符串数组即可。

```html
<script>
	window.$vutable = {
		title: "VUE TABLE DEMO",
		config: {
			label: ["[#]姓名", "年龄", "住址"],
			rowData: ["", true, ["北京", "上海", "广州"]],
		},
	};
</script>
```

如果您的列表显示内容和检索内容不相同 (key != value)，则该列配置`包含2个字符串数组的数组`即可，前一个为`value`，后一个为`key`。

```html
<script>
	window.$vutable = {
		title: "VUE TABLE DEMO",
		config: {
			label: ["[#]姓名", "年龄", "住址"],
			rowData: ["", true, [["BJ","北京"],["SH"," 上海"],["GZ","f广州"]]
		},
	};
</script>
```

## CSV 行内配置

你也可以完全不使用 JavaScript，直接在 CSV 文件内配置也是可以的，甚至两者混用也没有问题。

### 混合配置的要求

1. 如果在 JavaScript 中配置了`config.label`，就必须同时配置`config.rowData`

2. 可以只在 JavaScript 中配置`config.rowData`，而在 CSV 第 1 行配置`config.label`。

3. 除此之外的情况下， CSV 第 1 行配置`config.rowData`，第 2 行配置`config.label`

### 配置方法

基本配置方式和 JavaScript 中配置相同

```csv
null,null,null
姓名,年龄,住址
张三,20,北京
李四,25,上海
```

```html
<script>
	window.$vutable = {
		title: "VUE TABLE DEMO",
		config: {
			label: ["姓名", "年龄", "住址"],
			rowData: [null, null, null],
		},
	};
</script>
```

这二者是完全等效的。

### 唯一注意点

由于 CSV 是逗号间隔文件，所以不能在 CSV 文件内配置中使用英文逗号，所以在配置`config.rowData`项中的列表匹配模式时，需要用`|`替换`,`(替换所有的匹配)，如果你需要复杂的数组甚至数组函数，请使用 [JavaScript 配置方法](./#全局-javascript-配置)。

## 其他配置

### csv

```ts
csv: string;
```

配置项`csv`为`vutable`读取的`CSV`文件的路径，默认为`./data.csv`(相对于`index.html`的路径)，可以为远程资源。

### footer

```ts
footer: boolean;
```

控制是否显示默认页脚，默认为`true`，即显示页脚。
