# freee-lc

Luxury Card の明細ページにログインし、会計 freee の CSV アップロードに対応した形の CSV ファイルを自動生成するスクリプトです。

## Prerequisite

- Node.js v16.13.1

## Usage

**Setup**

```
git clone https://github.com/yikeda6616/freee-lc
yarn
```

yarn コマンド実行時に ログイン情報を書き込むための `.env` と CSV 出力先となる空の `dist/` がルートディレクトリに自動生成されます

**Edit Credential File**

`.env` の中身を以下のフォーマットで適宜入力してください。

```
USERNAME=hogehoge
PASSWORD=fugafuga
```

**Run**

```
yarn start
```

実行するとスクレイパーが走り、freee へのアップロードに対応した形式の CSV ファイル `payment_details.csv` が `dist/` ディレクトリに生成されます。

## Disclaimer

当リポジトリに掲載されたソースコード・情報・資料を利用、使用、ダウンロードするなどの行為に関連して生じたあらゆる損害等について、理由の如何に関わらず、一切責任を負いかねます。

あくまで自分の明細登録時に涙ながらに組んだ突貫作業プログラムです。使用は自己責任でお願いします。
