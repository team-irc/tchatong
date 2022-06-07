package utils

import (
	"strconv"
	"time"
)

// ParseTime
// YYYY-MM-DD hh-mm-ss 형식의 시간을 파싱함
func ParseTime(timeToParse string) (time.Time, error) {
	return time.Parse("2006-01-02 15:04:05", timeToParse)
}

// ParseIsoTime
// ISO 8601 형식의 시간을 파싱함
func ParseIsoTime(timeToParse string) (time.Time, error) {
	return time.Parse("2006-01-02T15:04:05Z0700", timeToParse)
}

// ParseUnixTime
// 1654599300000 형식의 UNIX millisecond timestamp를 파싱함
func ParseUnixTime(timeToParse string) (time.Time, error) {
	i, err := strconv.ParseInt(timeToParse, 10, 64)
	if err != nil {
		return time.Time{}, err
	}
	return time.Unix(0, i*int64(time.Millisecond)), nil
}
