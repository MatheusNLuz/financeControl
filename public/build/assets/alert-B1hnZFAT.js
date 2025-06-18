import{j as t}from"./app-PP8UZ6ZI.js";import{a,c as d,d as s}from"./button-DHS-6ac0.js";/**
 * @license lucide-react v0.515.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const n=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]],i=a("circle-check",n);/**
 * @license lucide-react v0.515.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m15 9-6 6",key:"1uzhvr"}],["path",{d:"m9 9 6 6",key:"z0biqf"}]],b=a("circle-x",g);/**
 * @license lucide-react v0.515.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]],k=a("info",u);/**
 * @license lucide-react v0.515.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y=[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",key:"wmoenq"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]],x=a("triangle-alert",y),m=s("relative w-full rounded-lg border px-4 py-3 text-sm grid grid-cols-[calc(var(--spacing)*4)_1fr] gap-x-3 gap-y-0.5 items-start [&>svg]:size-5 [&>svg]:translate-y-0.5 [&>svg]:flex-shrink-0",{variants:{variant:{default:"bg-background text-foreground border border-border dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700",success:"bg-green-50 text-green-800 border border-green-200 dark:bg-green-900/40 dark:text-green-400 dark:border-green-700",error:"bg-red-50 text-red-800 border border-red-200 dark:bg-red-900/40 dark:text-red-400 dark:border-red-700",warning:"bg-yellow-50 text-yellow-800 border border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-400 dark:border-yellow-700",info:"bg-blue-50 text-blue-800 border border-blue-200 dark:bg-blue-900/40 dark:text-blue-400 dark:border-blue-700"}},defaultVariants:{variant:"default"}}),p={success:i,error:b,warning:x,info:k,default:null};function v({className:r,variant:e="default",children:l,...c}){const o=p[e];return t.jsxs("div",{role:"alert",className:d(m({variant:e}),r),...c,children:[o&&t.jsx(o,{className:"text-current"}),l]})}function w({className:r,...e}){return t.jsx("div",{"data-slot":"alert-title",className:d("col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight",r),...e})}function _({className:r,...e}){return t.jsx("div",{"data-slot":"alert-description",className:d("col-start-2 grid justify-items-start gap-1 text-sm text-muted-foreground [&_p]:leading-relaxed",r),...e})}export{v as A,i as C,k as I,x as T,w as a,_ as b,b as c};
