# Booking Dashboard

## Quick Start

If you are using Linux and macOS it works out of the box following these steps:

1. Clone the repo
2. Default option should work fine. In case it doesn't then configure .env file for these two values in case of issue.
      ```
         VITE_API_BASE_URL=https://605c94c36d85de00170da8b4.mockapi.io
      ```

2. Make sure you are using the right Node.js version. This can optionally be done using a version manager like `nvm`:

    ```sh
    nvm use
    ```

3. Install Dependencies:

    ```sh
    npm install
    ```
4. Run:

   ```sh
    npm run dev
   ```
   URL: http://localhost:5173/
   Additional query param  can be added to view historical data: http://localhost:5173/?defaultDate=2020-09-01


5. Build :

    ```sh
    npm run build
    ```


6. Test
      ```sh
      npm run test:unit
      ```



## Project structure
   ```
src/
      apis/
      assets/
      components/
      includes/
      router/
      stores/
      types/
      views/
      utils/
```
More description about main components
1. apis- All apis call will be kept here.
2. components - This folder contains all the components that are being used on views with the intention of having a shared component library for easier extension and updates.
2. includes- This folder contains the helper/plugins libraries.
3. router- All routing information goes here.
4. stores - Stores related to different features are stored here.
5. types- TS interfaces/type.
6. views- Views combining several components and state logic. These are used to hook on routing.
7. utils - Shared helper functions. 


## State management
Used [Pinia](https://vuetifyjs.com/en/getting-started/installation/) along with reactive object (I've decided to stick with ref and used throughout the code instead of reactive.)


## Styling
For styling, TailWindCSS is used along with Hero Icons.

## Testing environment
   This web app is tested on IOS(Safari) and MacOS (Chrome).

## Things that can be improved
1. Add more comprehensive unit tests to work with ViTest.
2. Drag and drop in mobile devices can be improved.
3. Adding generic shared components such as Button, Links will be helpful for unit tests and reuse.
4. The beginning of week can be stored in local storage and retrieved in case user want to resume operation.
5. Header navigation menus for mobile devices can be shown vertically.

![Booking](screenshots/screen_booking.png?raw=true "Booking")
![Booking details](screenshots/screen_booking_detail.png?raw=true "Booking details")
![Booking details](screenshots/screen_booking_detail_mobile.png?raw=true "Booking details Mobile view")

# Vue 3 + TypeScript + Vite

This project was bootstrapped with
https://vitejs.dev/guide/
```
npm create vite@latest
```
This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).



         

