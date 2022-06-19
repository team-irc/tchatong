package controllers

import (
	"encoding/json"
	"github.com/gin-gonic/gin"
	"strconv"
	"tchatong.info/db"
	"tchatong.info/models"
	"tchatong.info/services"
	"time"
)

func GetEntireTopChatFire(c *gin.Context, mariaDB *db.MariaDB) {
	var streamerId string

	streamerId = c.Param("streamerId")
	c.JSON(200, services.GetEntireTopChatFire(streamerId, mariaDB))
}

func GetChatFireByInterval(c *gin.Context, mariaDB *db.MariaDB, redisDB *db.RedisDB) {
	var streamerId string
	var interval int

	streamerId = c.Param("streamerId")
	interval, err := strconv.Atoi(c.Param("interval"))
	if interval < 1 || interval > 60 {
		c.String(400, "interval scope is 1 <= interval <= 60")
	} else if err != nil {
		c.String(400, "interval should be number")
	} else {
		cache, err := redisDB.Get("chat-fire:" + streamerId + ":" + c.Param("interval")).Result()
		if err == nil && cache != "" {
			// 캐시가 있을 시 캐시 반환
			var cachedData []models.ChatFireResponse
			_ = json.Unmarshal([]byte(cache), &cachedData)
			c.JSON(200, cachedData)
		} else {
			// 캐시가 없을 시 response와 캐시(1분 뒤 만료) 생성하고 반환
			res := services.GetChatFireByInterval(streamerId, interval, mariaDB)
			b, _ := json.Marshal(res)
			redisDB.Set("chat-fire:"+streamerId+":"+c.Param("interval"), string(b), time.Minute)
			c.JSON(200, res)
		}
	}
}

func GetDayTopChatFire(c *gin.Context, mariaDB *db.MariaDB) {
	var streamerId string

	streamerId = c.Param("streamerId")
	c.JSON(200, services.GetDayTopChatFire(streamerId, mariaDB))
}

func GetCurrentChatFire(c *gin.Context, mariaDB *db.MariaDB) {
	var streamerId string

	streamerId = c.Param("streamerId")
	c.JSON(200, services.GetCurrentChatFire(streamerId, mariaDB))
}
