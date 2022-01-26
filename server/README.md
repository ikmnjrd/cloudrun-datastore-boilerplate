
`$ gcloud projects create node-datastore-test-111 --name node-datastore-test `
`$ gcloud config set project node-datastore-test-111`
`$ gcloud services enable artifactregistry.googleapis.com cloudbuild.googleapis.com`

`$ gcloud artifacts repositories create node-datastore-test-repo --repository-format=docker --location=asia-northeast1 --description="Docker repository hoge"`



## [「Identity and Access Management (IAM) API」を有効にする](https://console.cloud.google.com/flows/enableapi?apiid=iam.googleapis.com&redirect=https://console.cloud.google.com&_ga=2.232743135.1508092539.1642905291-660800505.1641690169&_gac=1.126930431.1641787854.CjwKCAiArOqOBhBmEiwAsgeLmUKyxFVA2G-PbQiGDcDshQWOkuOjierEGVir-P0Usxx6Q719ysIrXhoCfvkQAvD_BwE)


## [「Cloud Datastore API」を有効にする](https://console.cloud.google.com/flows/enableapi?apiid=datastore.googleapis.com)

## [Datastoreモードでデータベース作成](https://console.cloud.google.com/datastore/welcome?_ga=2.126773709.1508092539.1642905291-660800505.1641690169&_gac=1.55740377.1641787854.CjwKCAiArOqOBhBmEiwAsgeLmUKyxFVA2G-PbQiGDcDshQWOkuOjierEGVir-P0Usxx6Q719ysIrXhoCfvkQAvD_BwE)


# CloudRun?Datastore?用のサービスアカウントを作成する
## サービスアカウントを作成する
```
$ gcloud iam service-accounts create <SERVICE_ACCOUNT_ID> \
    --description="DESCRIPTION" \
    --display-name="DISPLAY_NAME"
```

`$ gcloud iam service-accounts create datastore1 --description="datastore用のサービスアカウント" --display-name="datastore-service-account"`

確認コマンド
`$ gcloud iam service-accounts list`

## サービスアカウントに権限を付与

`$ gcloud projects add-iam-policy-binding node-datastore-test-111 --member="serviceAccount:datastore1@node-datastore-test-111.iam.gserviceaccount.com" --role="roles/owner"`

## サービスアカウントキーを作成する

```
$ gcloud iam service-accounts keys create <key-file-name> \
    --iam-account=<service_account-name>@<project-id>.iam.gserviceaccount.com
```

`gcloud iam service-accounts keys create datastore1-iam-key-file.json --iam-account=datastore1@node-datastore-test-111.iam.gserviceaccount.com`



確認コマンド
```
$ gcloud iam service-accounts keys list \
    --iam-account=<service_account-name>@<project-id>.iam.gserviceaccount.com
```



### サービスアカウントキーファイルのパーミッションを変更する
初期状態は600になっている。
```
-rw-------    1 ike  staff   2344  1 24 03:32 datastore1-iam-key-file.json
```
`$ chmod 660 datastore1-iam-key-file.json`

## サービスアカウントキーファイルのパス指定
`$ echo 'export GOOGLE_APPLICATION_CREDENTIALS="$PWD/datastore1-iam-key-file.json"' >> ~/.bash_profile`
`$ source ~/.bash_profile`
or
app.jsなどに直接指定など


## 設定完了確認
`$ yarn start`

## 参考
- [サービスアカウントの作成方法](https://cloud.google.com/iam/docs/creating-managing-service-accounts#iam-service-accounts-create-gcloud)
- [サービスアカウントキーの作成方法](https://cloud.google.com/iam/docs/creating-managing-service-account-keys#iam-service-account-keys-create-gcloud)
- [構成の参考](https://zenn.dev/kimihiro_n/articles/06bd36a592a942)