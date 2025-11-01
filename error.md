تم رفع الموقع بنجاح لكن هناك بعض التحديرات والاخطاء في الاكونسول في بيئة الاننتاج رغم ان الموقع يعمل بشكل جيد بعد نشره لكن  محيا لا يضهر بعض المنتجات الهيرو ويضهر بعض الاخطاء في الكونسول 

هاذه جميع الاخطاء 

./components/VisitsAreaChart.tsx:149:23
Type error: Type '{ chart: { type: "area"; toolbar: { show: boolean; }; zoom: { enabled: boolean; }; animations: { enabled: boolean; easing: string; speed: number; }; }; dataLabels: { enabled: boolean; }; stroke: { curve: "smooth"; width: number; colors: string[]; }; ... 5 more ...; tooltip: { ...; }; }' is not assignable to type 'ApexOptions'.
  The types of 'chart.animations.easing' are incompatible between these types.
    Type 'string' is not assignable to type '"easeinout" | "linear" | "easein" | "easeout" | undefined'.
  147 |   return (
  148 |     <div className="h-full w-full">
> 149 |       <ReactApexChart options={options} series={series} type="area" height={280} />
      |                       ^
  150 |     </div>
  151 |   );
  152 | };
Next.js build worker exited with code: 1 and signal: null
error Command failed with exit code 1.
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
Error: Command "yarn build" exited with 1



تحديرات في بيئة الانتاج بعد نجاح النشر 

61:11  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
./app/product/[productSlug]/ProductContent.tsx
54:6  Warning: React Hook useEffect has missing dependencies: 'product?.price' and 'product?.title'. Either include them or remove the dependency array.  react-hooks/exhaustive-deps

اخطاء الموقع تضهر عند تشغيل نفس النسخة محليا رقم عدم وجودها بعد الشر 

Object
(index):1 Access to fetch at 'http://localhost:3001/api/hero' from origin 'http://192.168.8.100:3000' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.Understand this error
localhost:3001/api/hero:1  Failed to load resource: net::ERR_FAILEDUnderstand this error
hook.js:608 Error fetching hero data: TypeError: Failed to fetch
    at Hero.useEffect.fetchHeroData (C:\Users\elyas\Desktop\last-v ecom\techify\components\Hero.tsx:39:32)
    at Hero.useEffect (C:\Users\elyas\Desktop\last-v ecom\techify\components\Hero.tsx:52:5)
    at Object.react_stack_bottom_frame (react-dom-client.development.js:23669:20)
    at runWithFiberInDEV (react-dom-client.development.js:872:30)
    at commitHookEffectListMount (react-dom-client.development.js:12345:29)
    at commitHookPassiveMountEffects (react-dom-client.development.js:12466:11)
    at commitPassiveMountOnFiber (react-dom-client.development.js:14387:13)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:14360:11)
    at commitPassiveMountOnFiber (react-dom-client.development.js:14514:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:14360:11)
    at commitPassiveMountOnFiber (react-dom-client.development.js:14380:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:14360:11)
    at commitPassiveMountOnFiber (react-dom-client.development.js:14514:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:14360:11)
    at commitPassiveMountOnFiber (react-dom-client.development.js:14514:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:14360:11)
    at commitPassiveMountOnFiber (react-dom-client.development.js:14380:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:14360:11)
    at commitPassiveMountOnFiber (react-dom-client.development.js:14390:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:14360:11)
    at commitPassiveMountOnFiber (react-dom-client.development.js:14380:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:14360:11)
    at commitPassiveMountOnFiber (react-dom-client.development.js:14390:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:14360:11)
    at commitPassiveMountOnFiber (react-dom-client.development.js:14380:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:14360:11)
    at commitPassiveMountOnFiber (react-dom-client.development.js:14380:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:14360:11)
    at commitPassiveMountOnFiber (react-dom-client.development.js:14390:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:14360:11)
    at commitPassiveMountOnFiber (react-dom-client.development.js:14380:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:14360:11)
    at commitPassiveMountOnFiber (react-dom-client.development.js:14390:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:14360:11)
    at commitPassiveMountOnFiber (react-dom-client.development.js:14380:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:14360:11)
    at commitPassiveMountOnFiber (react-dom-client.development.js:14380:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:14360:11)
    at commitPassiveMountOnFiber (react-dom-client.development.js:14514:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:14360:11)
    at commitPassiveMountOnFiber (react-dom-client.development.js:14514:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:14360:11)
    at commitPassiveMountOnFiber (react-dom-client.development.js:14380:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:14360:11)
    at commitPassiveMountOnFiber (react-dom-client.development.js:14380:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:14360:11)
    at commitPassiveMountOnFiber (react-dom-client.development.js:14380:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:14360:11)
    at commitPassiveMountOnFiber (react-dom-client.development.js:14514:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:14360:11)
overrideMethod @ hook.js:608Understand this error
(index):1 Access to fetch at 'http://localhost:3001/api/products' from origin 'http://192.168.8.100:3000' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource.Understand this error
localhost:3001/api/products:1  Failed to load resource: net::ERR_FAILEDUnderstand this error
hook.js:608 Error fetching products: TypeError: Failed to fetch
    at Object.request (C:\Users\elyas\Desktop\last-v ecom\techify\lib\api.ts:73:12)
    at Object.get (C:\Users\elyas\Desktop\last-v ecom\techify\lib\api.ts:77:15)
    at ProductsSection.useEffect.fetchProducts (C:\Users\elyas\Desktop\last-v ecom\techify\components\ProductsSection.tsx:15:38)
    at ProductsSection.useEffect (C:\Users\elyas\Desktop\last-v ecom\techify\components\ProductsSection.tsx:34:5)
    at Object.react_stack_bottom_frame (react-dom-client.development.js:23669:20)
    at runWithFiberInDEV (react-dom-client.development.js:872:30)
    at commitHookEffectListMount (react-dom-client.development.js:12345:29)
    at commitHookPassiveMountEffects (react-dom-client.development.js:12466:11)
    at commitPassiveMountOnFiber (react-dom-client.development.js:14387:13)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:14360:11)
    at commitPassiveMountOnFiber (react-dom-client.development.js:14514:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:14360:11)
    at commitPassiveMountOnFiber (react-dom-client.development.js:14380:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:14360:11)
    at commitPassiveMountOnFiber (react-dom-client.development.js:14514:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:14360:11)
    at commitPassiveMountOnFiber (react-dom-client.development.js:14514:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:14360:11)
    at commitPassiveMountOnFiber (react-dom-client.development.js:14380:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:14360:11)
    at commitPassiveMountOnFiber (react-dom-client.development.js:14390:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:14360:11)
    at commitPassiveMountOnFiber (react-dom-client.development.js:14380:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:14360:11)
    at commitPassiveMountOnFiber (react-dom-client.development.js:14390:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:14360:11)
    at commitPassiveMountOnFiber (react-dom-client.development.js:14380:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:14360:11)
    at commitPassiveMountOnFiber (react-dom-client.development.js:14380:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:14360:11)
    at commitPassiveMountOnFiber (react-dom-client.development.js:14390:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:14360:11)
    at commitPassiveMountOnFiber (react-dom-client.development.js:14380:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:14360:11)
    at commitPassiveMountOnFiber (react-dom-client.development.js:14390:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:14360:11)
    at commitPassiveMountOnFiber (react-dom-client.development.js:14380:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:14360:11)
    at commitPassiveMountOnFiber (react-dom-client.development.js:14380:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:14360:11)
    at commitPassiveMountOnFiber (react-dom-client.development.js:14514:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:14360:11)
    at commitPassiveMountOnFiber (react-dom-client.development.js:14514:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:14360:11)
    at commitPassiveMountOnFiber (react-dom-client.development.js:14380:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:14360:11)
    at commitPassiveMountOnFiber (react-dom-client.development.js:14380:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:14360:11)
    at commitPassiveMountOnFiber (react-dom-client.development.js:14380:11)
    at recursivelyTraversePassiveMountEffects (react-dom-client.development.js:14360:11)
overrideMethod @ hook.js:608Understand this error
hot-reloader-app.js:197 [Fast Refresh] rebuilding
report-hmr-latency.js:14 [Fast Refresh] done in 1677ms
hot-reloader-app.js:197 [Fast Refresh] rebuilding
report-hmr-latency.js:14 [Fast Refresh] done in 2135ms
(index):1 Access to fetch at 'http://localhost:3001/api/users/email/msnmallouk2019@gmail.com' from origin 'http://192.168.8.100:3000' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource.Understand this error
localhost:3001/api/users/email/msnmallouk2019@gmail.com:1  Failed to load resource: net::ERR_FAILEDUnderstand this error
hook.js:608 Error fetching user by email: TypeError: Failed to fetch
    at Object.request (C:\Users\elyas\Desktop\last-v ecom\techify\lib\api.ts:73:12)
    at Object.get (C:\Users\elyas\Desktop\last-v ecom\techify\lib\api.ts:77:15)
    at Header.useCallback[getUserByEmail] (C:\Users\elyas\Desktop\last-v ecom\techify\components\Header.tsx:122:40)
    at Header.useEffect (C:\Users\elyas\Desktop\last-v ecom\techify\components\Header.tsx:134:5)