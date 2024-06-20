"use strict";(self.webpackChunktallyarbiter_docs=self.webpackChunktallyarbiter_docs||[]).push([[159],{2064:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>c,contentTitle:()=>o,default:()=>h,frontMatter:()=>i,metadata:()=>a,toc:()=>l});var r=t(5893),s=t(1151);const i={sidebar_position:1},o="Control Interface",a={id:"usage/control-interface",title:"Control Interface",description:"TallyArbiter runs an HTTP server listening on port 4455. If this port is in use and cannot be opened, you will receive an error.",source:"@site/docs/usage/control-interface.md",sourceDirName:"usage",slug:"/usage/control-interface",permalink:"/TallyArbiter/docs/usage/control-interface",draft:!1,unlisted:!1,editUrl:"https://github.com/josephdadams/TallyArbiter/edit/master/docs/docs/usage/control-interface.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"tutorialSidebar",previous:{title:"Build and run from source",permalink:"/TallyArbiter/docs/installation/from-source"},next:{title:"Devices",permalink:"/TallyArbiter/docs/usage/sections/devices"}},c={},l=[{value:"Configuration",id:"configuration",level:2}];function d(e){const n={a:"a",code:"code",h1:"h1",h2:"h2",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,s.a)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.h1,{id:"control-interface",children:"Control Interface"}),"\n",(0,r.jsxs)(n.p,{children:["TallyArbiter runs an HTTP server listening on port ",(0,r.jsx)(n.code,{children:"4455"}),". If this port is in use and cannot be opened, you will receive an error.\nTo get to the web interface, open your browser to ",(0,r.jsx)(n.a,{href:"http://127.0.0.1:4455",children:"http://127.0.0.1:4455"})," if you're on the same machine where you're running the software. If now, just replace ",(0,r.jsx)(n.code,{children:"127.0.0.1"})," with the IP of that machine."]}),"\n",(0,r.jsx)(n.p,{children:"If you're running the Desktop App, you get a window showing the GUI. However, the web interface is also available at the url described above."}),"\n",(0,r.jsx)(n.h2,{id:"configuration",children:"Configuration"}),"\n",(0,r.jsxs)(n.p,{children:["In the configuration interface, the settings page is available at ",(0,r.jsx)(n.code,{children:"/settings"}),": ",(0,r.jsx)(n.a,{href:"http://127.0.0.1:4455/settings",children:"http://127.0.0.1:4455/settings"}),"\n",(0,r.jsxs)(n.strong,{children:["This page is restricted by a username and password. The default username is ",(0,r.jsx)(n.code,{children:"admin"})," and the default password is ",(0,r.jsx)(n.code,{children:"12345"}),"."]})]}),"\n",(0,r.jsxs)(n.p,{children:["All the changes you make there are saved to a ",(0,r.jsx)(n.code,{children:"config.json"})," file. This file should also be backed up frequently to prevent data loss when updating. It's path is different depending on the OS that you're running:"]}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["Windows: ",(0,r.jsx)(n.code,{children:"C:\\Users\\YourUsername\\AppData\\Roaming\\TallyArbiter\\config.json"})]}),"\n",(0,r.jsxs)(n.li,{children:["MacOS: ",(0,r.jsx)(n.code,{children:"~/Library/Preferences/TallyArbiter/config.json"})]}),"\n",(0,r.jsxs)(n.li,{children:["Linux: ",(0,r.jsx)(n.code,{children:"~/.local/share/TallyArbiter/config.json"})]}),"\n"]}),"\n",(0,r.jsx)(n.p,{children:"You can also manually edit that file."}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"Make sure that TallyArbiter is closed while making changes, because otherwise they will be overwritten!"})}),"\n",(0,r.jsxs)(n.p,{children:["You can change the security of the settings and the producer page by adding or replacing the following section to your ",(0,r.jsx)(n.code,{children:"config.json"})," file:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-javascript",children:'{\n\t"security":\n\t{\n\t\t"username_settings": "admin",\n\t\t"password_settings": "12345",\n\t\t"username_producer": "producer",\n\t\t"password_producer": "12345"\n\t}\n}\n'})})]})}function h(e={}){const{wrapper:n}={...(0,s.a)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(d,{...e})}):d(e)}},1151:(e,n,t)=>{t.d(n,{Z:()=>a,a:()=>o});var r=t(7294);const s={},i=r.createContext(s);function o(e){const n=r.useContext(i);return r.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:o(e.components),r.createElement(i.Provider,{value:n},e.children)}}}]);