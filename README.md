# Message Exchange Module

## 設計

需求中不論server還是client，皆有可能作為發送端發送訊息或是接收方接收訊息，因此分成 **Sender(發送端)** 和 **Receiver(接收端)** 兩個角色

在該情境中最大的挑戰是「網路是不可靠的」因此身為

### Sender(發送端)

* 發送訊息後需要等待接收端ack message，確保接收端確實收到
* 接收端ack message之前，需要保留訊息以便之後重新發送
* 收到 `ack` 後，要回覆 `ack_received` 給接收端，讓接收端知道 `ack` 已經有被收到

### Receiver(接收端)

* 因為網路不穩，接收端極有可能收到重複的訊息，因此需要有機制濾掉重複的訊息
  * 無法確定使用該模組的client是否收到訊息會進行idempotent的操作，所以過濾比較安全
* 收到訊息後要ack給發送端，
* 等待發送端回覆 `ack_received` 前要保留能夠辨識message的方式，以便之後可以重新 `ack`


接收端與發送端分別透過 `ack` 和  `ack_received` 兩類個訊號，來得知對方有確實收到訊息，以此迴避網路不可靠這件事情

## 實作

## 說明

使用上會期待不管是client還是server使用方式皆相同，將雙方練線成功後的socket instance傳入factory method後，得到符合該client的exchanger，之後在交換訊息直接使用exchanger，不過在上述實作中還遺漏一件事情尚未處理

> 若exchanger的receiver收到的訊息並非控制訊息(`ack`, `ack_received`)，那該訊息應該的處理方式應該要由client進行實作

針對處理方式的實作上，若是如範例中同樣使用NodeJS的話，最簡便的方式會用callback處理，若是其他物件導向語言，則會讓exchanger在建立時，傳入的client是屬於實作某種interface，讓receiver可以反向invoke該**預期介面**的client去處理非其職責內的訊息
