// I didn't make this code, and I have no idea where on GitHub I took this :p

// Converts a snowflake ID string into a JS Date object using the provided epoch (in ms), or Discord's epoch if not provided
export function convertSnowflakeToDate(snowflake, epoch = 1420070400000) {
	const milliseconds = BigInt(snowflake) >> 22n
	return new Date(Number(milliseconds) + epoch)
}
