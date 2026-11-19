# RYHAN TV — Android অ্যাপ প্রজেক্ট

এটি HTML/CSS/JavaScript ভিত্তিক একটি স্টার্টার স্ট্রিমিং অ্যাপ। এতে ডেমো হিসেবে Blender Foundation-এর উন্মুক্ত চলচ্চিত্রের ভিডিও, সার্চ, My List/Favorites, এবং নিজের অনুমোদিত লাইভ স্ট্রিম যোগ করার ব্যবস্থা আছে।

## গুরুত্বপূর্ণ আইনি ও বাস্তব সীমা
- Netflix, পেইড স্পোর্টস, পেইড টিভি বা অন্য কোনো সাবস্ক্রিপশন কনটেন্টের অননুমোদিত লিংক দেওয়া নেই।
- লাইভ চ্যানেল যোগ করতে হলে চ্যানেল/প্রকাশকের অফিসিয়াল ফ্রি স্ট্রিম বা আপনার লিখিত অনুমতি থাকা URL ব্যবহার করুন।
- অ্যাপের মধ্যে ডেমো ভিডিওর লিংক তৃতীয় পক্ষের হোস্টে থাকে; তাদের প্রাপ্যতা/নীতিমালা বদলাতে পারে।
- এই প্রজেক্টে কোনো কনটেন্ট সার্ভার বা টিভি চ্যানেলের লাইসেন্স অন্তর্ভুক্ত নয়।

## Android APK বানানোর ধাপ

### যা লাগবে
কম্পিউটার (Windows/Mac/Linux), Node.js LTS, Android Studio এবং Android SDK। শুধু ফোন দিয়ে পূর্ণ APK build করা নির্ভরযোগ্য/সহজ নয়।

### ১) প্রজেক্ট খুলুন
ZIP extract করুন। ফোল্ডারের ভিতরে Terminal/Command Prompt খুলুন।

### ২) dependencies ইনস্টল
```bash
npm install
```

### ৩) Android project তৈরি
```bash
npx cap add android
```
যদি `android` ফোল্ডার আগে থেকেই থাকে, এই কমান্ড আর চালাবেন না।

### ৪) ওয়েব অ্যাপ build ও Android-এ sync
```bash
npm run cap:sync
```

### ৫) Android Studio-তে খুলুন
```bash
npx cap open android
```
Android Studio SDK/Gradle setup শেষ হলে ফোন USB দিয়ে যুক্ত করুন (Developer options + USB debugging চালু), অথবা emulator নির্বাচন করুন। Run চাপুন।

### ৬) APK তৈরি
Android Studio: **Build → Build Bundle(s) / APK(s) → Build APK(s)**।
সাধারণত APK পাওয়া যায়:
`android/app/build/outputs/apk/debug/app-debug.apk`

APK ফোনে কপি করে ইনস্টল করুন। Android-এ “Install unknown apps” অনুমতি চাইতে পারে। নিজের তৈরি APK শুধু বিশ্বস্ত উৎস থেকে ইনস্টল করুন।

## পরিবর্তন / নতুন চ্যানেল যোগ
অ্যাপ চালু করে নিচের “Add a channel” অংশে:
- Channel name
- Official HLS `.m3u8` অথবা MP4 stream URL (https)
- Poster image URL (optional)
দিয়ে Add channel চাপুন। ডেটা এই ডিভাইসের browser/app local storage-এ থাকে।

## সীমাবদ্ধতা
- এই স্টার্টার অ্যাপে user accounts, cloud sync, admin panel, DRM playback, payment, বা backend নেই।
- কিছু HLS stream Android WebView-তে nativeভাবে নাও চলতে পারে; তখন HLS.js বা native player integration লাগতে পারে।
- ফ্রি হোস্টিং/ডেটা/ভিডিও bandwidth-এর সীমা থাকতে পারে।
