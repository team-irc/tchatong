package models

import "time"

type UserInfo struct {
	Data []struct {
		ID              string    `json:"id"`
		Login           string    `json:"login"`
		DisplayName     string    `json:"display_name"`
		Type            string    `json:"type"`
		BroadcasterType string    `json:"broadcaster_type"`
		Description     string    `json:"description"`
		ProfileImageURL string    `json:"profile_image_url"`
		OfflineImageURL string    `json:"offline_image_url"`
		ViewCount       int       `json:"view_count"`
		CreatedAt       time.Time `json:"created_at"`
	} `json:"data"`
}

type StreamingInfo struct {
	Data []struct {
		ID           string    `json:"id"`
		UserID       string    `json:"user_id"`
		UserLogin    string    `json:"user_login"`
		UserName     string    `json:"user_name"`
		GameID       string    `json:"game_id"`
		GameName     string    `json:"game_name"`
		Type         string    `json:"type"`
		Title        string    `json:"title"`
		ViewerCount  int       `json:"viewer_count"`
		StartedAt    time.Time `json:"started_at"`
		Language     string    `json:"language"`
		ThumbnailURL string    `json:"thumbnail_url"`
		TagIds       []string  `json:"tag_ids"`
		IsMature     bool      `json:"is_mature"`
	} `json:"data"`
}

type FollowerInfo struct {
	Total int `json:"total"`
	Data  []struct {
		FromID     string    `json:"from_id"`
		FromLogin  string    `json:"from_login"`
		FromName   string    `json:"from_name"`
		ToID       string    `json:"to_id"`
		ToLogin    string    `json:"to_login"`
		ToName     string    `json:"to_name"`
		FollowedAt time.Time `json:"followed_at"`
	} `json:"data"`
}

type VideoInfo struct {
	Data []struct {
		ID            string      `json:"id"`
		StreamID      string      `json:"stream_id"`
		UserID        string      `json:"user_id"`
		UserLogin     string      `json:"user_login"`
		UserName      string      `json:"user_name"`
		Title         string      `json:"title"`
		Description   string      `json:"description"`
		CreatedAt     time.Time   `json:"created_at"`
		PublishedAt   time.Time   `json:"published_at"`
		URL           string      `json:"url"`
		ThumbnailURL  string      `json:"thumbnail_url"`
		Viewable      string      `json:"viewable"`
		ViewCount     int         `json:"view_count"`
		Language      string      `json:"language"`
		Type          string      `json:"type"`
		Duration      string      `json:"duration"`
		MutedSegments interface{} `json:"muted_segments"`
	} `json:"data"`
}
