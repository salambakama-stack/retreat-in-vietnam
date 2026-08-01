# 付款管理與回信流程

## 目前狀態

目前網站不串接藍新金流，也不建立付款頁。

付款管理以既有 Google 表單回覆試算表為唯一作業來源，不另外使用 CSV 或第二張管理表。

試算表：

`https://docs.google.com/spreadsheets/d/1njhAvw1A7E4nF32-M7QRxj2w7vMxSS_GM402Ed0TgKc/edit?gid=1106960327`

分頁：

`表單回覆 2`

`房型對照` 分頁已同步更新為目前網站使用的 7 個定稿房型名稱，舊房型名稱（如 `Wooden Villa`、`Twin Room 35`）已移除。

## 管理欄位

付款管理欄位已加在 `表單回覆 2` 分頁，從 `R` 欄開始：

| 欄位 | 名稱 | 用途 |
| --- | --- | --- |
| R | 房型總價 / Total Fee | 依 B 欄房型自動帶入總價 |
| S | 訂金 / Deposit | 自動帶入 NT$15,000 |
| T | 尾款 / Balance | 自動計算：房型總價 - 訂金 |
| U | 付款狀態 / Payment Status | 手動選擇付款狀態 |
| V | 訂金付款日 / Deposit Paid Date | 手動填寫 |
| W | 尾款付款日 / Balance Paid Date | 手動填寫 |
| X | 取消日 / Cancelled Date | 手動填寫 |
| Y | 回信狀態 / Email Status | 手動選擇 |
| Z | 付款備註 / Payment Notes | 手動填寫 |

## 付款狀態

`U` 欄固定使用以下狀態：

- 待付訂金
- 已付訂金
- 待付尾款
- 已完成付款
- 已取消

## 回信狀態

`Y` 欄固定使用以下狀態：

- 未回信
- 已回信
- 需追蹤

## 房型與金額

| 房型 | 房型總價 | 訂金 | 尾款 |
| --- | ---: | ---: | ---: |
| 花園雙床客房 / Garden Twin Room | NT$32,800 | NT$15,000 | NT$17,800 |
| 花園單人客房 25㎡ / Garden Single Room 25 sqm | NT$39,800 | NT$15,000 | NT$24,800 |
| 花園景觀單人房 35㎡ / Garden View Single Room 35 sqm | NT$42,800 | NT$15,000 | NT$27,800 |
| 庭園雙臥木屋｜四位同行 / Garden Bungalow for Four | NT$34,800 | NT$15,000 | NT$19,800 |
| 庭園雙臥木屋｜三位同行 / Garden Bungalow for Three | NT$40,800 | NT$15,000 | NT$25,800 |
| 獨棟庭園木屋｜兩人入住 / Private Bungalow for Two | NT$44,800 | NT$15,000 | NT$29,800 |
| 獨棟庭園木屋｜一人獨享 / Private Bungalow Single Stay | NT$53,800 | NT$15,000 | NT$38,800 |

## 學員端

公開網頁只顯示房型總價，不顯示尾款明細。

尾款資訊應在主辦單位確認報名後，以回信通知學員。回信模板位於：

`docs/payment-email-template.md`

## 取消政策

- 2026/9/30 前取消：扣除訂金後，其餘已繳費用全額退還。
- 2026/10/1～11/17 取消：扣除訂金後，其餘已繳費用退還 80%。
- 2026/11/18 起取消：已繳費用不予退還。

## 未來藍新串接

目前 `scripts/payment-config.mjs` 已保留：

- provider: `newebpay`
- providerPaymentId
- paidDepositAt
- paidBalanceAt
- cancelledAt

未來串接藍新時，可沿用同一組房型金額、訂金、尾款與付款狀態，不需要重改網站架構。
