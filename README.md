# 8thwall-vue3-threejs-boilerplate

This scaffolding allows you to easily develop 8th wall AR projects using Vue3, Three. js, and Typescript.

## Features
- Vite development environment
- Full TypeScript support
- Asset management
 
## Installation & Usage
You can choose to clone the project or fork repository, or download the zip file directly. It is recommended to clone the repository so that you can receive the latest patches.

To run a project, you need to have node version 16 or higher and use pnpm as your dependency management tool

Create .env file in the project root and specify your AppKey like below.

```bash
# .env
VITE_8THWALL_APP_KEY=xxxxxxxxxxxxxxxxxxx

```

## Build Setup
```bash
# Clone this repository
$ git clone https://github.com/ChihYungChang/8thwall-vue3-threejs-boilerplate.git
# Go into the repository
$ cd 8thwall-vue3-threejs-boilerplate
# install dependencies
$ pnpm install

# serve with hot reload at localhost:8080
$ pnpm dev

# build electron application for production
$ pnpm build
```

## Built-in
- vue-router
- pinia
- typescript
- three