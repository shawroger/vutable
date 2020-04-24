new Docute({
	target: "#app",
	title: "Vutable 文档",
	nav: [
		{
			title: "GitHub",
			link: "https://github.com/shawroger/vutable",
		},
	],

	sidebar: [
		{
			title: "快速开始",
			children: [
				{
					title: "修改 CSV 文件",
					link: "./#修改-csv-文件",
				},
				{
					title: "本地运行",
					link: "./#本地运行",
				},
				{
					title: "打包",
					link: "./#打包",
				},
			],
		},
		{
			title: "全局 JavaScript 配置",
			children: [
				{
					title: "title",
					link: "./#title",
				},
				{
					title: "config.label",
					link: "./#configlabel",
				},
				{
					title: "config.rowdata",
					link: "./#configrowdata",
				},
			],
		},
		{
			title: "CSV 行内配置",
			children: [
				{
					title: "混合配置的要求",
					link: "./#混合配置的要求",
				},
				{
					title: "配置方法",
					link: "./#配置方法",
				},
				{
					title: "唯一注意点",
					link: "./#唯一注意点",
				},
			],
		},
		{
			title: "其他配置",
			children: [
				{
					title: "csv",
					link: "./#csv",
				},
				{
					title: "footer",
					link: "./#footer",
				},
			],
		},
	],
});
