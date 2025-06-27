declare class ColorThief {
	getColor(image: HTMLImageElement): number[];
	getPalette(image: HTMLImageElement): number[][][];
}

interface LanyardFile {
	data: {
		kv: object;
		discord_user: UserObject;
		activities: ActivityObject[];
		discord_status: string;
		active_on_discord_web: boolean;
		active_on_discord_desktop: boolean;
		active_on_discord_mobile: boolean;
		active_on_discord_embedded: boolean;
		listening_to_spotify: boolean;
		spotify: SpotifyObject;
	};
	success: boolean;
}

interface UserObject {
	id: string;
	username: string;
	avatar: string;
	discriminator: string;
	clan: object;
	primary_guild: GuildObject;
	avatar_decoration_data: DecorationObject;
	collectibles: {
		nameplates: NameplateObject;
	};
	bot: boolean;
	global_name: string;
	display_name: string;
	public_flags: number;
}

interface GuildObject {
	tag: string;
	identity_guild_id: string;
	badge: string;
	identity_enabled: boolean;
}

interface DecorationObject {
	sku_id: string;
	asset: string;
	expires_at: string;
}

interface NameplateObject extends DecorationObject {
	label: string;
	palette: string;
}

interface ActivityObject {
	flags?: number;
	id: string;
	name: string;
	type: number;
	state: string;
	metadata: object;
	session_id: string;
	details?: string;
	timestamps?: {
		start: number;
		end?: number;
	};
	assets?: {
		large_image?: string;
		large_text?: string;
		small_image?: string;
		small_text?: string;
	};
	sync_id?: string;
	application_id?: string;
	emoji?: object;
	created_at: number;
	buttons?: string[];
	platform?: string;
	party?: {
		id: string;
		size?: number;
	}
}

interface SpotifyObject {
	timestamps: {
		start: number;
		end: number;
	};
	album: string;
	album_art_url: string;
	artist: string;
	song: string;
	track_id: string;
}

type FetchUserFunction = (userId: string) => Promise<LanyardFile>;
