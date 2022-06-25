package controllers

import (
	"encoding/json"
	"github.com/gin-gonic/gin"
	"tchatong.info/db"
	"tchatong.info/models"
	"tchatong.info/services"
	"time"
)

func GetChatfirePerHour(c *gin.Context, redisDB *db.RedisDB, bigQueryDB *db.BigQuery) {
	cache, err := redisDB.Get("statistics:chatfire:hour").Result()
	if err == nil && cache != "" {
		// 캐시가 있을 시 캐시 반환
		var cachedData []models.ChatfirePerHour
		_ = json.Unmarshal([]byte(cache), &cachedData)
		c.JSON(200, cachedData)
	} else {
		// 캐시가 없을 시 response와 캐시(1시간 뒤 만료) 생성하고 반환
		res := services.GetChatfirePerHour(bigQueryDB)
		b, _ := json.Marshal(res)
		redisDB.Set("statistics:chatfire:hour", string(b), time.Hour)
		c.JSON(200, res)
	}
}
