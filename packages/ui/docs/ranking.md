> 注意！获奖选手请填写站内问卷，便于证书信息收集和奖品证书寄送。

## 奖励说明

### 北京大学选手

获奖阈值：150分

共产生：一等奖 5 名，二等奖 10 名，三等奖 15 名，优胜奖 9 名

分数线：一等奖：1425，二等奖：1148，三等奖621

### 其他选手

#### 协办高校选手

特殊说明，因协办高校同学二等奖和三等奖分数线严重低于校内分数线和总排名分数线，故二等奖名额缩减至5名，三等奖名额缩减至10名。

一等奖分数线：1346，二等奖分数线：1000，三等奖分数线544

#### 其他选手

按协办高校分数线可申请获奖证书，最多寄出30份。

### 所有分数大于100分的选手

可领取申请参赛纪念

## 奖励发放方式

包括比赛奖励和纪念品。个人所得税按20%税率由北京大学代缴，发放时您收到的奖金可能低于公示值。

1. **北大同学，于颁奖典礼统一发放，若无法到场，可于Linux俱乐部联系领取**
2. **协作高校同学，奖励寄送至协作组织，由协作组织负责发放**
3. **其他校外同学，填写问卷，由组委会寄出**

1. 首先检查盖章单位与签发人。获奖证书由北京大学计算中心、北京大学计算与数字经济研究院、共青团北京大学信息科学技术学院委员会，共青团北京大学计算机学院委员会盖章
2. 如1中材料仍不足以核验纸质版真伪，请发送邮件至`hpcgame@pku.edu.cn`，并提供证书图片，将在两个工作日内回复

### 电子版核验指南

1. 所有选手的获奖证书由`GPG`公钥签发，您可以点击此处[HPCGame证书签名核验站](https://hpcgame.pku.edu.cn/gpgsign)上传选手获奖证明的电子版和证书编号，进行核验。
2. 您也可以线下手工核验相关信息：参考以下步骤
   1. 我们的`GPG　key fingerprint`是
      
      ```
      -----------------------------
      sec   rsa3072/8BC99E120AC60F2A 2023-03-03 [SC] [expires: 2025-03-02]
            09F76FCC953469FFEFB433878BC99E120AC60F2A
      uid   [ultimate] PKU HPCGame committee (GPG key for 0th and 1th PKU HPCGame) <hpcgame@pku.edu.cn>
      -----------------------------
      ```
   2. 在[比赛Github repo](https://github.com/lcpu-club/hpcgame-0th)根目录获取组委会公钥，第零届和第一届比赛公钥名为：`0th_1th_publickey.asc`
   3. 在[比赛Github repo](https://github.com/lcpu-club/hpcgame-0th)`award`文件夹下，获取选手对应证书的`sig`文件，文件命名为`获奖证书编号.sig`
   4. 进行核验
      1. `gpg --import public.key`
      2. `gpg --verify 获奖证书编号.pdf.sig 获奖证书编号.pdf`
      3. 如果是组委会签名的获奖证书，则为有效

## 获奖名单

注：获奖名单顺序由选手成绩排名决定

### 北京大学获奖名单

#### 一等奖

彭伟桀、袁屹宁、梁家硕、郭俊毅、周可行

#### 二等奖

谭亦轩、吴自华、王卓峰、楼涵月、杨嘉宏、马文晗、陶仕龙、孙绍聪、刘仲皓、黄翟

#### 三等奖

仲殷旻、熊云帆、金则宇、李佳衡、金少亮、崔亦彤、杨亦晨、陈晓雨、黄煦喆、燕浩波、邹鲁童、鲁一逍、高玮泽、林殷年、陈光

#### 优胜奖

蔡鹏霖、徐凯风、陈国赐、扈官威、段国阳、胡锦浩、张子涵、何文阳、王启奡

#### 新生奖

王卓峰、黄翟、黄煦喆

### 协办高校获奖名单

#### 一等奖

| 所属高校     | 昵称       | 邮箱前3位 | ID后6位  |
|:-------- |:-------- | ----- |:------ |
| 复旦大学     | 楼下大爷高抬贵手 | che   | PEwGHb |
| 北京邮电大学   | 喵喵喵      | ren   | SA1stV |
| 华中科技大学   | mgt      | mgt   | cjM8pP |
| 中国科学技术大学 | jpy794   | hao   | FW7tgF |
| 复旦大学     | Alice    | zxy   | WlwE5f |

#### 二等奖

| 所属高校     | 昵称          | 邮箱前3位 | ID后6位  |
|:-------- |:----------- | ----- |:------ |
| 中国科学技术大学 | oat         | tao   | YeAulb |
| 中国科学技术大学 | ymgu        | guy   | VVIE9L |
| 北京邮电大学   | 7mile       | 7li   | XQOYiL |
| 复旦大学     | 大菠萝         | 222   | AT7UHs |
| 中国科学技术大学 | 凑个 1000 分开摆 | yjh   | mktK9W |

#### 三等奖

| 所属高校     | 昵称              | 邮箱前3位 | ID后6位  |
|:-------- |:--------------- | ----- |:------ |
| 东南大学     | JinBridge       | jin   | -YnRZ0 |
| 中山大学     | ITcarrot        | luo   | zoNGlX |
| 东南大学     | idawnlight      | 213   | 81OC-5 |
| 中国科学技术大学 | gongsiqiu       | gon   | G9AL5M |
| 复旦大学     | Sabaki          | 221   | 60XMXa |
| 北京航空航天大学 | 20373067        | 203   | ToPxR6 |
| 北京理工大学   | 梦想是摊煎饼          | 322   | avyGko |
| 北京航空航天大学 | 瑟瑟发抖            | 223   | hzQt-R |
| 中国科学技术大学 | Psycho Commando | lon   | Ca-V-K |
| 中国科学技术大学 | 我超 简单题怎么这么难     | ksq   | WOcFeL |

### 第二阶段

#### DEM

| 获奖团队         | ID后6位  | 备注           |
|:------------ |:------ | ------------ |
| Steins; Gate | kh8Kza | 提交正确，加速比3.58 |

团队成员：

| 团队名          | 成员昵称 | ID后6位  |
|:------------ | ---- |:------ |
| Steins; Gate | 吴自华  | Zsa2e0 |

#### linpack

| 获奖团队               | ID后6位  | 备注         |
|:------------------ |:------ | ---------- |
| TheThreeMusketeers | qDsL9W | 提交正确，排名1/1 |

团队成员：

| 团队名                | 成员昵称          | ID后6位  |
|:------------------ | ------------- |:------ |
| TheThreeMusketeers | zengpengfei20 | FrMqdO |
|                    | laiqiang20    | k3UzAD |

#### cufft

| 获奖团队  | ID后6位  | 备注            |
|:----- |:------ | ------------- |
| 0.382 | IkOMw9 | 提交正确，加速比1.585 |
| YeS   | COaSGs | 提交正确，加速比1.19  |
| 咸     | PJcj6O | 提交正确，加速比1.107 |

各团队成员：

| 团队名   | 成员昵称      | ID后6位  |
|:----- | --------- |:------ |
| 0.382 | 金少亮       | 35XHuY |
| YeS   | 袁屹宁       | q99ibo |
|       | STL       | oelGYZ |
| 咸     | 王卓峰       | fILHq2 |
|       | wangy2529 | k92KKc |
|       | luowb2004 | vRyz6H |
