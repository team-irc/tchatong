package db

import (
	"context"
	"github.com/go-redis/redis/v8"
	"os"
	"time"
)

type RedisDB struct {
	client *redis.Client
}

func (redisDB RedisDB) New() *RedisDB {
	redisHost := os.Getenv("REDIS_HOST")
	redisPort := os.Getenv("REDIS_PORT")
	client := redis.NewClient(&redis.Options{
		Addr:     redisHost+":"+redisPort,
		Password: "",
		DB:       0,
	})
	if err := client.Ping(context.Background()).Err(); err != nil {
		panic(err)
	}
	return &RedisDB{client}
}

func (redisDB RedisDB) Get(key string) *redis.StringCmd {
	return redisDB.client.Get(context.Background(), key)
}

func (redisDB RedisDB) Set(key string, value interface{}, expire time.Duration) *redis.StatusCmd {
	return redisDB.client.Set(context.Background(), key, value, expire)
}
