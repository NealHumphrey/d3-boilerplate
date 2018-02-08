# d3-boilerplate
A charting library created to provide a consistent structure for reusable D3 visualizations. 

# Concept

If you spend time creating an interesting chart in D3, you should be able to put it into multiple places on your page, or be able to adapt it to use in a new project without needing to copy-paste it in. In addition, lots of reusable charts need similar things, like code to create the SVG or adjust the width. Why write the same code every time?

There are a few core chart code architecture principles this project pushes you to use:
* Setup/Resize/Update pattern to separate logic from the get-go, whether or not you'll need to resize or update the chart data. 
* Custom getters/setters to allow method chaining
* A base chart that supplies commonly used utility functions, like autoresize

Read about these design choices and the genesis of d3-boilerplate [on this blog post](http://nhumphrey.com/blog/2017/Reusable-D3-Charts/)

# Use

This project hasn't yet been turned into a true package yet - I spun it out of [Housing Insights](https://github.com/codefordc/housing-insights/) where it was just part of the source code. As such, the easiest way to use it is to copy the `/src` files into your project. Or, you can link directly to the files you need from the RawGit CDN. 

```
<script src="https://rawgit.com/NealHumphrey/d3-boilerplate/master/src/base.js"></script><!--needed for all projects-->
<script src="https://rawgit.com/NealHumphrey/d3-boilerplate/master/src/utils.js"></script><!--include if you want to use autoresize-->
<script src="https://rawgit.com/NealHumphrey/d3-boilerplate/master/src/donut-chart.js"></script>
<script src="https://rawgit.com/NealHumphrey/d3-boilerplate/master/src/bar-chart.js"></script>
```

Currently there's no guarantees on keeping the file structure or maintaining the API of how the chart objects work. I'm still working out what the ways are to make this useful as a reusable tool rather than just a collection of charts I've made. If you find the idea interesting and want to help figure these problems out, let me know!

**Coming soon:** build tools and a single-file package. 



