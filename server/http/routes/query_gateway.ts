import { Request, Response } from "express";
import { unixInSeconds } from "../../../utils";
import Config from "../../../utils/Config";

export default function handler(req: Request, res: Response) {
	return res.send(JSON.stringify({
		account_url: `http://${Config.GAMESERVER.HOST}/account`,
		account_url_backup: `http://${Config.GAMESERVER.HOST}/account`,
		asset_bundle_url_list: getAssetUrl(String(req.query.version)),
		ex_audio_and_video_url_list: getAVUrl(String(req.query.version)),
		ex_resource_url_list: getResUrl(String(req.query.version)),
		ext: getGatewayExt(String(req.query.version)),
		gameserver: {
			ip: Config.PROXY.USE_PROXY ? "127.0.0.1" : Config.GAMESERVER.HOST,
			port: Config.PROXY.USE_PROXY ? Config.PROXY.LOCAL_PORT : Config.GAMESERVER.PORT,
		},
		gateway: {
			ip: Config.PROXY.USE_PROXY ? "127.0.0.1" : Config.GAMESERVER.HOST,
			port: Config.PROXY.USE_PROXY ? Config.PROXY.LOCAL_PORT : Config.GAMESERVER.PORT,
		},
		is_data_ready: true,
		msg: "",
		oaserver_url: `http://${Config.GAMESERVER.HOST}/oaserver`,
		region_name: Config.GAMESERVER.REGION_NAME,
		retcode: 0,
		server_cur_time: unixInSeconds,
		server_cur_timezone: 7,
		server_ext: {
			cdkey_url: `https://${Config.GAMESERVER.HOST}/common/`,
			mihoyo_sdk_env: "2",
			use_account_web_url: 1
		},
	}));
}

export const getGatewayExt = (version: string) => {
	return{
		"ai_use_asset_boundle": "1",
		"apm_log_level": "2",
		"apm_switch": "1",
		"apm_switch_crash": "1",
		"data_use_asset_boundle": "1",
		"enable_watermark": "1",
		"ex_audio_and_video_url_list": getAVUrl(version),
		"ex_res_pre_publish": "0",
		"ex_res_use_http": "0",
		"ex_resource_url_list": getResUrl(version),
		"forbid_recharge": "1",
		"is_checksum_off": "1",
		"mtp_debug_switch": "0",
		"mtp_level": "1",
		"offline_report_switch": "1",
		"res_use_asset_boundle": "1",
		"show_version_text": "0",
		"update_streaming_asb": "1",
		"use_multy_cdn": "1",
		"apm_log_dest": "2",
		"apm_switch_game_log": "1",
		"block_error_dialog": "1",
		"elevator_model_path": "GameEntry/EVA/StartLoading_Model",
		"ex_res_buff_size": "10485760",
		"is_xxxx": "0",
		"mtp_switch": "0",
		"network_feedback_enable": "0",
		"show_bulletin_button": "0",
		"show_bulletin_empty_dialog_bg": "0",
	}
}

const getAssetUrl = (version: string): string[] => {
	const regex = /^(.*?)_(os|gf|global)_(.*?)$/;
	const matches = version.match(regex);

	if (matches) {
		const type = matches[2]; // get the second group (os or gf)
		
		switch (type) {
			case 'os':
				return Config.USE_LOCAL_CACHE ? [
					`http://${Config.GAMESERVER.HOST}/asset_bundle/overseas01/1.1`,
					`http://${Config.GAMESERVER.HOST}/asset_bundle/overseas01/1.1`,
				] : [
					"https://hk-bundle-os-mihayo.akamaized.net/asset_bundle/overseas01/1.1",
					"https://bundle-aliyun-os.honkaiimpact3.com/asset_bundle/overseas01/1.1",
				]
			case 'gf':
				if(version.includes("beta")){
					return Config.USE_LOCAL_CACHE ? [
						`https://${Config.GAMESERVER.HOST}/asset_bundle/beta_release/1.0`,
						`https://${Config.GAMESERVER.HOST}/asset_bundle/beta_release/1.0`,
					] : [
						"https://bh3rd-beta-qcloud.bh3.com/asset_bundle/beta_release/1.0",
						"https://bh3rd-beta.bh3.com/asset_bundle/beta_release/1.0",
					]
				}
				return Config.USE_LOCAL_CACHE ? [
					`https://${Config.GAMESERVER.HOST}/asset_bundle/android01/1.0`,
					`https://${Config.GAMESERVER.HOST}/asset_bundle/android01/1.0`,
				] : [
					"https://bundle-qcloud.bh3.com/asset_bundle/android01/1.0",
					"https://bundle.bh3.com/asset_bundle/android01/1.0",
				]
			case 'global':
				return Config.USE_LOCAL_CACHE ? [
					`https://${Config.GAMESERVER.HOST}/asset_bundle/usa01/1.1`,
					`https://${Config.GAMESERVER.HOST}/asset_bundle/usa01/1.1`,
				] : [
					"http://hk-bundle-west-mihayo.akamaized.net/asset_bundle/usa01/1.1",
					"http://bundle-aliyun-usa.honkaiimpact3.com/asset_bundle/usa01/1.1",
				]
			default:
				return Config.USE_LOCAL_CACHE ? [
					`http://${Config.GAMESERVER.HOST}/asset_bundle/overseas01/1.1`,
					`http://${Config.GAMESERVER.HOST}/asset_bundle/overseas01/1.1`,
				] : [
					"https://hk-bundle-os-mihayo.akamaized.net/asset_bundle/overseas01/1.1",
					"https://bundle-aliyun-os.honkaiimpact3.com/asset_bundle/overseas01/1.1",
				]
		}
	} else return Config.USE_LOCAL_CACHE ? [
		`http://${Config.GAMESERVER.HOST}/asset_bundle/overseas01/1.1`,
		`http://${Config.GAMESERVER.HOST}/asset_bundle/overseas01/1.1`,
	] : [
		"https://hk-bundle-os-mihayo.akamaized.net/asset_bundle/overseas01/1.1",
		"https://bundle-aliyun-os.honkaiimpact3.com/asset_bundle/overseas01/1.1",
	]
}

const getAVUrl = (version: string): string[] | undefined => {
	if (version.includes("gf")&&version.includes("beta")) {
		return Config.USE_LOCAL_CACHE ? [
			`${Config.GAMESERVER.HOST}/tmp/CGAudio`,
			`${Config.GAMESERVER.HOST}/tmp/CGAudio`,
		] : [
			"bh3rd-beta-qcloud.bh3.com/tmp/CGAudio",
			"bh3rd-beta.bh3.com/tmp/CGAudio",
		]
	} else return undefined
}

const getResUrl = (version: string): string[] => {
	const regex = /^(.*?)_(os|gf|global)_(.*?)$/;
	const matches = version.match(regex);

	if (matches) {
		const type = matches[2]; // get the second group (os or gf)
		
		switch (type) {
			case 'os':
				return Config.USE_LOCAL_CACHE ? [
					`${Config.GAMESERVER.HOST}/com.miHoYo.bh3oversea`,
					`${Config.GAMESERVER.HOST}/com.miHoYo.bh3oversea`
				] : [
					"hk-bigfile-os-mihayo.akamaized.net/com.miHoYo.bh3oversea",
					"bigfile-aliyun-os.honkaiimpact3.com/com.miHoYo.bh3oversea"
				]
			case 'gf':
				if(version.includes("beta")){
					return Config.USE_LOCAL_CACHE ? [
						`${Config.GAMESERVER.HOST}/tmp/beta`,
						`${Config.GAMESERVER.HOST}/tmp/beta`,
					] : [
						"bh3rd-beta-qcloud.bh3.com/tmp/beta",
						"bh3rd-beta.bh3.com/tmp/beta",
					]
				}
				return Config.USE_LOCAL_CACHE ? [
					`${Config.GAMESERVER.HOST}/tmp/Original`,
					`${Config.GAMESERVER.HOST}/tmp/Original`,
				] : [
					"bundle-qcloud.bh3.com/tmp/Original",
					"bundle.bh3.com/tmp/Original",
				]
			case 'global':
				return Config.USE_LOCAL_CACHE ? [
					`${Config.GAMESERVER.HOST}/tmp/com.miHoYo.bh3global`,
					`${Config.GAMESERVER.HOST}/tmp/com.miHoYo.bh3global`,
				] : [
					"hk-bundle-west-mihayo.akamaized.net/tmp/com.miHoYo.bh3global",
					"bigfile-aliyun-usa.honkaiimpact3.com/tmp/com.miHoYo.bh3global",
				]
			default:
				return Config.USE_LOCAL_CACHE ? [
					`${Config.GAMESERVER.HOST}/com.miHoYo.bh3oversea`,
					`${Config.GAMESERVER.HOST}/com.miHoYo.bh3oversea`
				] : [
					"hk-bigfile-os-mihayo.akamaized.net/com.miHoYo.bh3oversea",
					"bigfile-aliyun-os.honkaiimpact3.com/com.miHoYo.bh3oversea"
				]
		}
	} else return Config.USE_LOCAL_CACHE ? [
		`${Config.GAMESERVER.HOST}/com.miHoYo.bh3oversea`,
		`${Config.GAMESERVER.HOST}/com.miHoYo.bh3oversea`
	] : [
		"hk-bigfile-os-mihayo.akamaized.net/com.miHoYo.bh3oversea",
		"bigfile-aliyun-os.honkaiimpact3.com/com.miHoYo.bh3oversea"
	]
}