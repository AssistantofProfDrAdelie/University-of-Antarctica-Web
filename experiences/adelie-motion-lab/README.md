# 阿德利企鹅运动压缩实验 · Adelie Motion Lab

南极大学网站内的独立实验模块。真实阿德利企鹅视频 → GrabCut 透明裁剪 → silhouette 与逐帧运动数据 → 规则像素化 → 4/6/8 帧、24/32/64 像素 sprite sheet → viewer。没有使用生成式图像 AI，也没有引用现成企鹅 sprite。

[网站查看器](./index.html)位于现有仓库的 `experiences/` 目录；当前 GitHub Pages 工作流直接发布仓库中的静态页面。查看器所用图片和 `assets/manifest.js` 已提交。可在仓库根目录运行 `python3 -m http.server 8000`，打开 `/experiences/adelie-motion-lab/` 本地查看。原始视频和临时分析文件不纳入 Git。

## 重新生成

需要 Python 3、OpenCV、NumPy 和 Pillow：

```bash
python3 -m pip install -r experiences/adelie-motion-lab/requirements.txt
```

从 [Wikimedia Commons 原视频页面](https://commons.wikimedia.org/wiki/File:Ad%C3%A9lie_penguin_(Pygoscelis_adeliae)_in_Antarctica.webm) 下载原片，保存为 `experiences/adelie-motion-lab/data/adelie_source.webm`，然后在模块目录运行：

```bash
python3 pipeline.py
```

输出写入 `assets/`。`manifest.json` 包含每一分析帧的时间、质心、身体轴倾角、头部近似位置、翅膀横向范围与面积；`manifest.js` 供无需构建的页面读取。`key_crops/` 与 `key_silhouettes/` 是 6 个关键姿态，`sheet_*` 是可供手工修像素的透明 PNG。仓库中保留查看器逐帧图片、manifest 和九种 sprite sheet；额外的拼贴预览及原始视频由本地重跑生成。

## 替换输入视频

```bash
python3 pipeline.py --input /absolute/path/to/your_penguin.mp4 --start 2.4 --end 6.0 --rect 245 125 155 220
```

`--rect X Y W H` 是分析宽度 640 像素下的企鹅周围裁剪框。选择单只企鹅、侧面、背景较简洁的连续行走镜头，调整 `--start`、`--end` 和 `--rect`，保证企鹅一直在框内。视频比例不同可用 `--analysis-width` 调整，同时相应调整裁剪框。重跑后检查 manifest、关键姿态和 sprite，按需提交更新的 viewer 资源。页面中的原视频入口指向 Commons；换片时也应更新该入口及下方署名。

## 方法与限制

- 在裁剪框中逐帧执行 GrabCut，取最接近目标中心的前景连通域，再闭运算修小孔。遮挡、复杂背景和快速出框可能需要手工调整。
- 从二值前景求质心、身体轴、头部近似位置及翅膀横向范围。这些是几何启发式，不是解剖关键点预测；脚部位置只有下部中心近似值。
- 比较位移归一化后的 32×32 轮廓与姿态特征，选择相似片段并采样 4/6/8 帧。当前自动找到约 **0.33 秒的候选重复窗口**，需要人工确认它是否覆盖完整左右步态，还是仅为半步。它不是已确认的完整 gait cycle，也不是科学测量值。
- 按真实前景亮度划分黑羽和白腹，再用固定色规则着色；高分辨率头部加入极小白眼圈。透明 PNG 可以继续手修杂点、脚、眼圈及循环衔接。
- 播放控件的点击行为在原型阶段尚未完成可靠的浏览器交互验证。

## 影像来源与授权

原片 **“Adélie penguin (Pygoscelis adeliae) in Antarctica.webm”**，作者 **Lauren Farmer**，2012 年 11 月拍摄。[来源](https://commons.wikimedia.org/wiki/File:Ad%C3%A9lie_penguin_(Pygoscelis_adeliae)_in_Antarctica.webm) · [Creative Commons Attribution 3.0 Unported](https://creativecommons.org/licenses/by/3.0/)。本模块展示由该影像裁剪、分割、缩放与重新着色的改编图像，并在查看器保留作者、来源和许可链接。原片不纳入 Git 或公开网站；本仓库的网页代码和脚本不改变原视频及衍生影像的 CC BY 3.0 归属。
