    /*
    ** Watch_Face_Editor tool
    ** watchface js version v2.0.1
    ** Copyright © CashaCX75. All Rights Reserved
    */

    try {
    (()=>{
        //dynamic modify start

        
        let normal_background_bg_img = ''
        let normal_system_disconnect_img = ''
        let normal_distance_text_text_img = ''
        let normal_step_current_text_img = ''
        let normal_step_image_progress_img_level = ''
        let normal_date_img_date_month_img = ''
        let normal_date_img_date_day = ''
        let normal_city_name_text = ''
        let normal_temperature_current_text_img = ''
        let normal_weather_image_progress_img_level = ''
        let normal_heart_rate_text_text_img = ''
        let normal_battery_text_text_img = ''
        let normal_battery_image_progress_img_level = ''
        let normal_digital_clock_img_time_AmPm = ''
        let normal_digital_clock_img_time = ''
        let normal_date_img_date_week_img = ''
        let normal_frame_animation_1 = ''
        let normal_frame_animation_2 = ''
        let normal_analog_clock_time_pointer_second = ''
        let idle_background_bg_img = ''
        let idle_system_disconnect_img = ''
        let idle_digital_clock_img_time = ''
        let normal_alarm_jumpable_img_click = ''
        let normal_temperature_jumpable_img_click = ''
        let normal_heart_jumpable_img_click = ''
        let normal_step_jumpable_img_click = ''


        //dynamic modify end
        const e = __$$hmAppManager$$__.currentApp;
        const o = e.current
          , {px: i} = (new DeviceRuntimeCore.WidgetFactory(new DeviceRuntimeCore.HmDomApi(e,o)),
        e.__globals__)
          , n = Logger.getLogger("watchface6");
        o.module = DeviceRuntimeCore.WatchFace({
            init_view() {
                //dynamic modify start
                    
                
            normal_background_bg_img = hmUI.createWidget(hmUI.widget.IMG, {
              x: 0,
              y: 0,
              w: 466,
              h: 466,
              src: 'MAIN.png',
              show_level: hmUI.show_level.ONLY_NORMAL,
            });

            normal_system_disconnect_img = hmUI.createWidget(hmUI.widget.IMG_STATUS, {
              x: 288,
              y: 367,
              src: 'bluetooth.png',
              type: hmUI.system_status.DISCONNECT,
              show_level: hmUI.show_level.ONLY_NORMAL,
            });

            normal_distance_text_text_img = hmUI.createWidget(hmUI.widget.TEXT_IMG, {
              x: 345,
              y: 297,
              font_array: ["Distance_00.png","Distance_01.png","Distance_02.png","Distance_03.png","Distance_04.png","Distance_05.png","Distance_06.png","Distance_07.png","Distance_08.png","Distance_09.png"],
              padding: false,
              h_space: 0,
              dot_image: 'Distance_dote.png',
              align_h: hmUI.align.CENTER_H,
              type: hmUI.data_type.DISTANCE,
              show_level: hmUI.show_level.ONLY_NORMAL,
            });

            normal_step_current_text_img = hmUI.createWidget(hmUI.widget.TEXT_IMG, {
              x: 336,
              y: 264,
              font_array: ["Numbers_steps_00.png","Numbers_steps_01.png","Numbers_steps_02.png","Numbers_steps_03.png","Numbers_steps_04.png","Numbers_steps_05.png","Numbers_steps_06.png","Numbers_steps_07.png","Numbers_steps_08.png","Numbers_steps_09.png"],
              padding: false,
              h_space: -1,
              align_h: hmUI.align.CENTER_H,
              type: hmUI.data_type.STEP,
              show_level: hmUI.show_level.ONLY_NORMAL,
            });

            normal_step_image_progress_img_level = hmUI.createWidget(hmUI.widget.IMG_LEVEL, {
              x: 276,
              y: 173,
              image_array: ["steps_goal_01.png","steps_goal_02.png","steps_goal_03.png","steps_goal_04.png","steps_goal_05.png","steps_goal_06.png","steps_goal_07.png","steps_goal_08.png","steps_goal_09.png","steps_goal_9.png","steps_goal_10.png","steps_goal_11.png"],
              image_length: 12,
              type: hmUI.data_type.STEP,
              show_level: hmUI.show_level.ONLY_NORMAL,
            });

            normal_date_img_date_month_img = hmUI.createWidget(hmUI.widget.IMG_DATE, {
              month_startX: 207,
              month_startY: 44,
              month_sc_array: ["Month_01.png","Month_02.png","Month_03.png","Month_04.png","Month_05.png","Month_06.png","Month_07.png","Month_08.png","Month_09.png","Month_10.png","Month_11.png","Month_12.png"],
              month_tc_array: ["Month_01.png","Month_02.png","Month_03.png","Month_04.png","Month_05.png","Month_06.png","Month_07.png","Month_08.png","Month_09.png","Month_10.png","Month_11.png","Month_12.png"],
              month_en_array: ["Month_01.png","Month_02.png","Month_03.png","Month_04.png","Month_05.png","Month_06.png","Month_07.png","Month_08.png","Month_09.png","Month_10.png","Month_11.png","Month_12.png"],
              month_is_character: true ,
              show_level: hmUI.show_level.ONLY_NORMAL,
            });

            normal_date_img_date_day = hmUI.createWidget(hmUI.widget.IMG_DATE, {
              day_startX: 175,
              day_startY: 46,
              day_sc_array: ["Numbers_month_00.png","Numbers_month_01.png","Numbers_month_02.png","Numbers_month_03.png","Numbers_month_04.png","Numbers_month_05.png","Numbers_month_06.png","Numbers_month_07.png","Numbers_month_08.png","Numbers_month_09.png"],
              day_tc_array: ["Numbers_month_00.png","Numbers_month_01.png","Numbers_month_02.png","Numbers_month_03.png","Numbers_month_04.png","Numbers_month_05.png","Numbers_month_06.png","Numbers_month_07.png","Numbers_month_08.png","Numbers_month_09.png"],
              day_en_array: ["Numbers_month_00.png","Numbers_month_01.png","Numbers_month_02.png","Numbers_month_03.png","Numbers_month_04.png","Numbers_month_05.png","Numbers_month_06.png","Numbers_month_07.png","Numbers_month_08.png","Numbers_month_09.png"],
              day_zero: 1,
              day_space: -1,
              day_align: hmUI.align.LEFT,
              day_is_character: false,
              show_level: hmUI.show_level.ONLY_NORMAL,
            });

            normal_city_name_text = hmUI.createWidget(hmUI.widget.TEXT, {
              x: 13,
              y: 262,
              w: 283,
              h: 48,
              text_size: 24,
              char_space: 0,
              line_space: 0,
              color: 0xFFC0C4C1,
              align_h: hmUI.align.CENTER_H,
              align_v: hmUI.align.CENTER_V,
              text_style: hmUI.text_style.ELLIPSIS,
              show_level: hmUI.show_level.ONLY_NORMAL,
            });

            normal_temperature_current_text_img = hmUI.createWidget(hmUI.widget.TEXT_IMG, {
              x: 382,
              y: 155,
              font_array: ["numbers_weather_00.png","numbers_weather_01.png","numbers_weather_02.png","numbers_weather_03.png","numbers_weather_04.png","numbers_weather_05.png","numbers_weather_06.png","numbers_weather_07.png","numbers_weather_08.png","numbers_weather_09.png"],
              padding: false,
              h_space: -1,
              unit_sc: 'numbers_weather_C.png',
              unit_tc: 'numbers_weather_C.png',
              unit_en: 'numbers_weather_C.png',
              negative_image: 'numbers_weather_minus.png',
              align_h: hmUI.align.CENTER_H,
              type: hmUI.data_type.WEATHER_CURRENT,
              show_level: hmUI.show_level.ONLY_NORMAL,
            });

            normal_weather_image_progress_img_level = hmUI.createWidget(hmUI.widget.IMG_LEVEL, {
              x: 345,
              y: 146,
              image_array: ["1.png","2.png","3.png","4.png","5.png","6.png","7.png","8.png","9.png","10.png","11.png","12.png","13.png","14.png","15.png","16.png","17.png","18.png","19.png","20.png","21.png","22.png","23.png","24.png","25.png","26.png","27.png","28.png","29.png"],
              image_length: 29,
              type: hmUI.data_type.WEATHER_CURRENT,
              show_level: hmUI.show_level.ONLY_NORMAL,
            });

            normal_heart_rate_text_text_img = hmUI.createWidget(hmUI.widget.TEXT_IMG, {
              x: 171,
              y: 381,
              font_array: ["BPM_00.png","BPM_01.png","BPM_02.png","BPM_03.png","BPM_04.png","BPM_05.png","BPM_06.png","BPM_07.png","BPM_08.png","BPM_09.png"],
              padding: false,
              h_space: -3,
              align_h: hmUI.align.RIGHT,
              type: hmUI.data_type.HEART,
              show_level: hmUI.show_level.ONLY_NORMAL,
            });

            normal_battery_text_text_img = hmUI.createWidget(hmUI.widget.TEXT_IMG, {
              x: 266,
              y: 312,
              font_array: ["Battery_numbers_00.png","Battery_numbers_01.png","Battery_numbers_02.png","Battery_numbers_03.png","Battery_numbers_04.png","Battery_numbers_05.png","Battery_numbers_06.png","Battery_numbers_07.png","Battery_numbers_08.png","Battery_numbers_09.png"],
              padding: false,
              h_space: -4,
              align_h: hmUI.align.CENTER_H,
              type: hmUI.data_type.BATTERY,
              show_level: hmUI.show_level.ONLY_NORMAL,
            });

            normal_battery_image_progress_img_level = hmUI.createWidget(hmUI.widget.IMG_LEVEL, {
              x: 63,
              y: 293,
              image_array: ["Battery_00.png","Battery_01.png","Battery_02.png","Battery_03.png","Battery_04.png","Battery_05.png","Battery_06.png","Battery_07.png"],
              image_length: 8,
              type: hmUI.data_type.BATTERY,
              show_level: hmUI.show_level.ONLY_NORMAL,
            });

            normal_digital_clock_img_time_AmPm = hmUI.createWidget(hmUI.widget.IMG_TIME, {
              am_x: 261,
              am_y: 209,
              am_sc_path: 'AM.png',
              am_en_path: 'AM.png',
              pm_x: 261,
              pm_y: 209,
              pm_sc_path: 'PM.png',
              pm_en_path: 'PM.png',
              show_level: hmUI.show_level.ONLY_NORMAL,
            });

            normal_digital_clock_img_time = hmUI.createWidget(hmUI.widget.IMG_TIME, {
              hour_startX: 18,
              hour_startY: 170,
              hour_array: ["Numbers_HnM_00.png","Numbers_HnM_01.png","Numbers_HnM_02.png","Numbers_HnM_03.png","Numbers_HnM_04.png","Numbers_HnM_05.png","Numbers_HnM_06.png","Numbers_HnM_07.png","Numbers_HnM_08.png","Numbers_HnM_09.png"],
              hour_zero: 1,
              hour_space: 7,
              hour_align: hmUI.align.LEFT,

              minute_startX: 150,
              minute_startY: 170,
              minute_array: ["Numbers_HnM_00.png","Numbers_HnM_01.png","Numbers_HnM_02.png","Numbers_HnM_03.png","Numbers_HnM_04.png","Numbers_HnM_05.png","Numbers_HnM_06.png","Numbers_HnM_07.png","Numbers_HnM_08.png","Numbers_HnM_09.png"],
              minute_zero: 1,
              minute_space: 8,
              minute_follow: 0,
              minute_align: hmUI.align.LEFT,

              second_startX: 263,
              second_startY: 159,
              second_array: ["Numbers_S_00.png","Numbers_S_01.png","Numbers_S_02.png","Numbers_S_03.png","Numbers_S_04.png","Numbers_S_05.png","Numbers_S_06.png","Numbers_S_07.png","Numbers_S_08.png","Numbers_S_09.png"],
              second_zero: 1,
              second_space: 2,
              second_follow: 0,
              second_align: hmUI.align.LEFT,

              show_level: hmUI.show_level.ONLY_NORMAL,
            });

            normal_date_img_date_week_img = hmUI.createWidget(hmUI.widget.IMG_WEEK, {
              x: 0,
              y: 35,
              week_en: ["Week_day_01.png","Week_day_02.png","Week_day_03.png","Week_day_04.png","Week_day_05.png","Week_day_06.png","Week_day_07.png"],
              week_tc: ["Week_day_01.png","Week_day_02.png","Week_day_03.png","Week_day_04.png","Week_day_05.png","Week_day_06.png","Week_day_07.png"],
              week_sc: ["Week_day_01.png","Week_day_02.png","Week_day_03.png","Week_day_04.png","Week_day_05.png","Week_day_06.png","Week_day_07.png"],
              show_level: hmUI.show_level.ONLY_NORMAL,
            });

            normal_frame_animation_1 = hmUI.createWidget(hmUI.widget.IMG_ANIM, {
              x: 14,
              y: 42,
              anim_path: "animation",
              anim_ext: "png",
              anim_prefix: "animation",
              anim_fps: 24,
              anim_size: 26,
              repeat_count: 1,
              anim_repeat: false,
              anim_status:hmUI.anim_status.START,
              show_level: hmUI.show_level.ONLY_NORMAL,
            });

            normal_frame_animation_2 = hmUI.createWidget(hmUI.widget.IMG_ANIM, {
              x: 130,
              y: 177,
              anim_path: "animation",
              anim_ext: "png",
              anim_prefix: "anim_column",
              anim_fps: 10,
              anim_size: 10,
              repeat_count: 0,
              anim_repeat: true,
              anim_status:hmUI.anim_status.START,
              show_level: hmUI.show_level.ONLY_NORMAL,
            });

            // normal_analog_clock_time_pointer_second = hmUI.createWidget(hmUI.widget.TIME_POINTER, {
            //  second_path: 'Hand_Second_2.png',
            //  second_centerX: 233,
            //  second_centerY: 233,
            //  second_posX: 103,
            //  second_posY: 233,
            //  show_level: hmUI.show_level.ONLY_NORMAL,
            // });
            
                    // SMOOTH SECONDS Definition
        let second_centerX = 233;
        let second_centerY = 233;
        let second_posX = 103;
        let second_posY = 233;
        let second_path = "Hand_Second_2.png";
        // ----------------------------
        let sec_pointer;
        let clock_timer;
        let animAngle = 0;
        let animDelay = 0;
        const animFps = 30;                             // Frames per second 
        const animRepeat = 1000 / animFps;              // then execute every <animRepeat>ms
        const deviceInfo = hmSetting.getDeviceInfo();   // Needed for automatic screen size detection
        // SMOOTH SECONDS Definition End

        sec_pointer = hmUI.createWidget(hmUI.widget.IMG, {
          x: 0,
          y: 0,
          w: deviceInfo.width,
          h: deviceInfo.height,
          pos_x: second_centerX - second_posX,
          pos_y: second_centerY - second_posY,
          center_x: second_centerX,
          center_y: second_centerY,
          src: second_path,
          angle: 0,
          show_level: hmUI.show_level.ONLY_NORMAL,
        });

        let bazel = hmUI.createWidget(hmUI.widget.IMG, {
          x: 0,
          y: 0,
          src: 'false_dote.png',
          angle: 0,
          show_level: hmUI.show_level.ONLY_NORMAL,
        });

        const now = hmSensor.createSensor(hmSensor.id.TIME);

        const vDelegate = hmUI.createWidget(hmUI.widget.WIDGET_DELEGATE, {
          resume_call: (function () {
            console.log('ui resume');

            if (!clock_timer) {
              console.log('createTimer');
              clock_timer = timer.createTimer(animDelay, animRepeat, (function (option) {
                animAngle = (now.second * 6) + (((now.utc % 1000) / 1000) * 6);
                sec_pointer.setProperty(hmUI.prop.ANGLE, animAngle);
              }));
            }
          }),
          pause_call: (function () {
            console.log('ui pause');
            if (clock_timer) {
              timer.stopTimer(clock_timer);
              clock_timer = undefined;
              console.log('stopTimer');
            }
          }),

        });
        // End Smooth Seconds



            idle_background_bg_img = hmUI.createWidget(hmUI.widget.IMG, {
              x: 0,
              y: 0,
              w: 466,
              h: 466,
              src: 'MAIN_AOD.png',
              show_level: hmUI.show_level.ONLY_AOD,
            });

            idle_system_disconnect_img = hmUI.createWidget(hmUI.widget.IMG_STATUS, {
              x: 288,
              y: 367,
              src: 'bluetooth.png',
              type: hmUI.system_status.DISCONNECT,
              show_level: hmUI.show_level.ONLY_AOD,
            });

            idle_digital_clock_img_time = hmUI.createWidget(hmUI.widget.IMG_TIME, {
              hour_startX: 18,
              hour_startY: 170,
              hour_array: ["Numbers_HnMAOD_00.png","Numbers_HnMAOD_01.png","Numbers_HnMAOD_02.png","Numbers_HnMAOD_03.png","Numbers_HnMAOD_04.png","Numbers_HnMAOD_05.png","Numbers_HnMAOD_06.png","Numbers_HnMAOD_07.png","Numbers_HnMAOD_08.png","Numbers_HnMAOD_09.png"],
              hour_zero: 1,
              hour_space: 7,
              hour_align: hmUI.align.LEFT,

              minute_startX: 150,
              minute_startY: 170,
              minute_array: ["Numbers_HnMAOD_00.png","Numbers_HnMAOD_01.png","Numbers_HnMAOD_02.png","Numbers_HnMAOD_03.png","Numbers_HnMAOD_04.png","Numbers_HnMAOD_05.png","Numbers_HnMAOD_06.png","Numbers_HnMAOD_07.png","Numbers_HnMAOD_08.png","Numbers_HnMAOD_09.png"],
              minute_zero: 1,
              minute_space: 8,
              minute_follow: 0,
              minute_align: hmUI.align.LEFT,

              show_level: hmUI.show_level.ONLY_AOD,
            });
            
            // disconnectAlert = hmUI.createWidget(hmUI.widget.DisconnectAlert, {
              // disconneсnt_vibrate_type: 9,
              // conneсnt_vibrate_type: 9,
              // conneсnt_toast_text: CONNECTION RESTORED,
            // });

            // vibration when connecting or disconnecting

            function checkConnection() {
              hmBle.removeListener;
              hmBle.addListener(function (status) {
                if(!status) {
                  vibro(9);
                }
                if(status) {
                  hmUI.showToast({text: "CONNECTION RESTORED"});
                  vibro(9);
                }
              });
            }

            // end vibration when connecting or disconnecting
            // vibrate function

            const vibrate = hmSensor.createSensor(hmSensor.id.VIBRATE);
            let timer_StopVibrate = null;


            function vibro(scene = 25) {
              let stopDelay = 50;
              stopVibro();
              vibrate.scene = scene;
              if(scene < 23 || scene > 25) stopDelay = 1300;
              vibrate.start();
              timer_StopVibrate = timer.createTimer(stopDelay, 3000, stopVibro, {});
            }

            function stopVibro(){
              vibrate.stop();
              if(timer_StopVibrate) timer.stopTimer(timer_StopVibrate);
            }

            // end vibrate function

            normal_alarm_jumpable_img_click = hmUI.createWidget(hmUI.widget.IMG_CLICK, {
              x: 15,
              y: 166,
              w: 244,
              h: 83,
              src: 'click_e.png',
              type: hmUI.data_type.COUNT_DOWN,
              show_level: hmUI.show_level.ONLY_NORMAL,
            });

            normal_temperature_jumpable_img_click = hmUI.createWidget(hmUI.widget.IMG_CLICK, {
              x: 338,
              y: 146,
              w: 103,
              h: 40,
              src: 'click_e.png',
              type: hmUI.data_type.WEATHER_CURRENT,
              show_level: hmUI.show_level.ONLY_NORMAL,
            });

            normal_heart_jumpable_img_click = hmUI.createWidget(hmUI.widget.IMG_CLICK, {
              x: 130,
              y: 377,
              w: 156,
              h: 38,
              src: 'click_e.png',
              type: hmUI.data_type.HEART,
              show_level: hmUI.show_level.ONLY_NORMAL,
            });

            normal_step_jumpable_img_click = hmUI.createWidget(hmUI.widget.IMG_CLICK, {
              x: 301,
              y: 189,
              w: 140,
              h: 139,
              src: 'click_e.png',
              type: hmUI.data_type.STEP,
              show_level: hmUI.show_level.ONLY_NORMAL,
            });

            function scale_call() {

              console.log('Wearther city name');
              const weatherSensor = hmSensor.createSensor(hmSensor.id.WEATHER);
              const weatherData = weatherSensor.getForecastWeather();
              normal_city_name_text.setProperty(hmUI.prop.TEXT, weatherData.cityName);

            };

            const widgetDelegate = hmUI.createWidget(hmUI.widget.WIDGET_DELEGATE, {
              resume_call: (function () {
                scale_call();
                normal_frame_animation_1.setProperty(hmUI.prop.ANIM_STATUS,hmUI.anim_status.START);
                normal_frame_animation_2.setProperty(hmUI.prop.ANIM_STATUS,hmUI.anim_status.START);
                checkConnection();
                stopVibro();

              }),
              pause_call: (function () {
                normal_frame_animation_1.setProperty(hmUI.prop.ANIM_STATUS,hmUI.anim_status.STOP);
                normal_frame_animation_2.setProperty(hmUI.prop.ANIM_STATUS,hmUI.anim_status.STOP);
                stopVibro();

              }),
            });

                //dynamic modify end
            },
            onInit() {
                n.log("index page.js on init invoke")
            },
            build() {
                this.init_view(),
                n.log("index page.js on ready invoke")
            },
            onDestroy() {
                n.log("index page.js on destroy invoke")
            }
        })
    }
    )()
} catch (e) {
    console.log("Mini Program Error", e),
    e && e.stack && e.stack.split(/\n/).forEach((e=>console.log("error stack", e)))
}
