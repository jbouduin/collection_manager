import type { ForgeConfig } from "@electron-forge/shared-types";
import { MakerSquirrel } from "@electron-forge/maker-squirrel";
import { MakerZIP } from "@electron-forge/maker-zip";
import { MakerDeb } from "@electron-forge/maker-deb";
import { MakerRpm } from "@electron-forge/maker-rpm";
import { AutoUnpackNativesPlugin } from "@electron-forge/plugin-auto-unpack-natives";
import { WebpackPlugin } from "@electron-forge/plugin-webpack";
import { FusesPlugin } from "@electron-forge/plugin-fuses";
import { FuseV1Options, FuseVersion } from "@electron/fuses";

import { mainConfig } from "./.cm/configs/webpack.main.config";
import { rendererConfig } from "./.cm/configs/webpack.renderer.config";

const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
    icon: "/assets/icons/collection_manager_512"
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel(
      {
        certificateFile: "./.cm/collection_manager.pfx",
        certificatePassword: process.env.CERTIFICATE_PASSWORD
      }),
    new MakerZIP({}, ["darwin"]),
    new MakerRpm({}),
    new MakerDeb({})
  ],
  publishers: [
    {
      name: "@electron-forge/publisher-github",
      config: {
        repository: {
          owner: "jbouduin",
          name: "collection_manager"
        },
        prerelease: false,
        draft: true
      }
    }
  ],
  plugins: [
    new AutoUnpackNativesPlugin({}),
    new WebpackPlugin({
      devContentSecurityPolicy: 'default-src \'self\' \'unsafe-inline\' data:; script-src \'self\' \'unsafe-eval\' \'unsafe-inline\' data:; img-src * data: cached-image: asset:',
      mainConfig,
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            html: "./src/renderer/main-window/main-window.html",
            js: "./src/renderer/main-window/main-window-renderer.ts",
            name: "main_window",
            preload: {
              js: "./src/renderer/shared/preload.ts",
            },
          },
          {
            html: "./src/renderer/first-time/first-time.html",
            js: "./src/renderer/first-time/first-time-renderer.ts",
            name: "first_time",
            preload: {
              js: "./src/renderer/shared/preload.ts",
            },
          },
          {
            html: "./src/renderer/splash-window/splash-window.html",
            js: "./src/renderer/splash-window/splash-window-renderer.ts",
            name: "splash_window",
            preload: {
              js: "./src/renderer/shared/preload.ts",
            },
          },
        ],
      },
    }),
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};

export default config;
