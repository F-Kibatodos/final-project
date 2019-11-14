# AC 飲料店 (簡易電商平台 DEMO)
* 運用 Node.js, MySQL 製作的一個前後端應用程式。
* 這是一個針對具有小規模的實體店家所設計的簡易電商平台。因應消費者的購物型態的改變，讓實體店家能掌握既有和接觸到更多的潛在消費者。
* 優惠券、電子會員卡、電子郵件發送等功能，會於之後陸續開發補上。

## 使用者故事列表
商家和消費者可以分別進行以下的操作：

|  #  | 操作者| 執行動作                      |是(1)否(0)完成 |
|:---:|------|:-----------------------------:| :-----:|
|  1  | 消費者 | 在首頁查看所有商品               |       1        |
|  2  | 消費者 | 在首頁進行搜尋                   |       1        |
|  3  | 消費者 | 在首頁進行篩選                   |       1        |
|  4  | 消費者 | 載入編輯個人資料頁面             |       1        |
|  5  | 消費者 | 更新個人資料                     |       1        |
|  6  | 消費者 | 載入店家聯絡資訊                 |       1        |
|  7  | 消費者 | 載入單一商品資料                 |       1        |
|  8  | 消費者 | 於單一產品頁看見評論             |       1        |
|  9  | 消費者 | 於個人的單一訂單頁可以新增評論   |       1        |
| 10  | 消費者 | 於單一產品頁修改自己的評論       |       1        |
| 11  | 消費者 | 將商品加入購物車                 |       1        |
| 12  | 消費者 | 載入目前自己的購物車內容         |       1        |
| 13  | 消費者 | 於購物車頁面選擇要結的項目       |       1        |
| 14  | 消費者 | 於購物車頁面調整數量和品項       |       1        |
| 15  | 消費者 | 可以刪除購物車品項              |        1        |
| 15  | 消費者 | 可輸入運送資訊                   |       1        |
| 16  | 消費者 | 可做訂單的最後確認               |       1        |
| 17  | 消費者 | 可以成功付款                     |       1        |
| 17  | 消費者 | 付款成功品項會從購物車清掉       |       1        |
| 18  | 消費者 | 可查看自己的所有訂單             |       1        |
| 19  | 消費者 | 可查看自己的願望清單             |       1        |
| 20  | 消費者 | 可於 Google Map 上查看分店資訊   |       1        |
| 21  | 消費者 | 可使用直接購買                   |       1        |
| 22  | 消費者 | 使用折扣券時若沒有達到門檻會提醒 |       1        |
| 22  | 消費者 | 可以使用折扣券                   |       1        |
| 23  | 消費者 | 評論時必須給評分                 |       1        |
| 24  | 消費者 | 註冊時信箱不符格式會提示          |        1        |
| 25  | 消費者 | 編輯個人資料時提醒必須輸入名稱     |        1        |
| 26  | 消費者 | 編輯個人資料時提醒須符合特定格式   |         1        |
| 27  | 消費者 |  商品加入購物車時會提示           |         1        |
| 28  | 管理者 | 可於每個管理頁面使用搜尋         |       1        |
| 29  | 管理者 | 可載入全部使用者資料             |       1        |
| 30  | 管理者 | 可修改使用者權限                 |       1        |
| 31  | 管理者 | 可載入全部訂單資料               |       1        |
| 32  | 管理者 | 可查看每筆訂單詳情               |       1        |
| 33  | 管理者 | 可修改部分訂單內容               |       1        |
| 34  | 管理者 | 可刪除訂單                       |       1        |
| 35  | 管理者 | 可載入全部商品資料               |       1        |
| 36  | 管理者 | 可新增商品                       |       1        |
| 37  | 管理者 | 可選擇讓商品上/下架              |       1        |
| 38  | 管理者 | 可更新商品                       |       1        |
| 39  | 管理者 | 可刪除商品                       |       1        |
| 40  | 管理者 | 可載入全部折扣券資料             |       1        |
| 41  | 管理者 | 可新增折扣券                     |       1        |
| 42  | 管理者 | 可更新折扣券                     |       1        |
| 43  | 管理者 | 可刪除折扣券                     |       1        |
| 44  | 管理者 | 可載入全部類別資料               |       1        |
| 45  | 管理者 | 可新增種類                       |       1        |
| 46  | 管理者 | 可更新種類                       |       1        |
| 47  | 管理者 | 可刪除種類                       |       1        |
| 48  | 管理者 | 可載入全部店面資訊               |       1        |
| 49  | 管理者 | 可新增分店資訊                   |       1        |

## 環境建置與需求
* [Node.js version 10.16.0 (LTS)](https://nodejs.org/en/)
* 一系列的 npm 套件，詳請可見[這個連結](https://tinyurl.com/wkhxnpy)

## How to use? 如何使用？
### 網站版 (Site)
* 請點選右邊的網址前往：https://damp-cliffs-89201.herokuapp.com/
### 本機版 (Local)
1. 將專案下載在自己的電腦
```
git clone https://github.com/F-Kibatodos/final-project.git
```
2. 利用 terminal 或是 cmd 輸入以下指令(假設下載到 download 資料夾)
```
cd "download/final-project"
```
3. 接著，安裝相關的套件
```
npm install 
```
4. 再來，輸入以下指令
```
npm run dev
```
5. 產生資料庫 Model
```
npx sequelize db:migrate
```
6. 產生種子資料
```
npx sequelize db:seed:all
```
7. 在專案根目錄下新增 .env 檔案，並儲存以下資訊
```
FACEBOOK_ID=(請自行申請)
FACEBOOK_SECRET=(請自行申請)
FACEBOOK_CALLBACK=http://localhost:3000/auth/facebook/callback

GOOGLE_ID=(請自行申請)
GOOGLE_SECRET=(請自行申請)
GOOGLE_CALLBACK=http://localhost:3000/auth/google/callback

GITHUB_CLIENT_ID=(請自行申請)
GITHUB_CLIENT_SECRET=(請自行申請)
GITHUB_CALLBACK=http://localhost:3000/auth/github/callback

IMGUR_CLIENT_ID=(請自行申請)
```
8. 最後打開瀏覽器，輸入 localhost:3000 就可開始使用
* 管理員帳號/密碼：請私訊詢問
* 一般使用者帳號/密碼：user1@example.com / 12345678

## 作者
* [F-Kibatodos](https://github.com/F-Kibatodos)
* [umbrally](https://github.com/umbrally)
* [SMLPoints](https://github.com/andy922200)
