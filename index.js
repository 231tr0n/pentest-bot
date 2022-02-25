require('dotenv').config();
const discord = require('discord.js');

global.db = {};
const sf = require('./helpers');
const commands = require('./commands');
require('./config');

global.bot = new discord.Client({
	intents: [
		discord.Intents.FLAGS.GUILDS,
		discord.Intents.FLAGS.GUILD_VOICE_STATES,
		discord.Intents.FLAGS.GUILD_MESSAGES,
		discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
		discord.Intents.FLAGS.DIRECT_MESSAGES,
		discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
		discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
		discord.Intents.FLAGS.GUILD_MESSAGE_TYPING,
		discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING,
		discord.Intents.FLAGS.GUILD_PRESENCES,
		discord.Intents.FLAGS.GUILD_MEMBERS
	]
});

bot.on('ready', async () => {
	if (!sf.load_backup()) {
		console.log('Backup File is corrupted. Please consult bot-devs once about this message.');
		console.log('If you want the bot to be working for now, please delete the "backup_data.json" file to get the bot to work.(Note: This will delete all your backup data!)');
		process.exit();
	} else {
		try {
			const guild =  bot.guilds.cache.get(server_id);
			await guild.members.fetch();
			if (bot.guilds.cache.get(server_id)) {
				for (const id of status_updates_channels) {
					await bot.channels.cache.get(id).send('Hi. The Bot is online. I will be patrolling and monitoring you pretty closely. Don\'t try to evade status updates.');
				}
				for (const id of admin_commands_channels) {
					await bot.channels.cache.get(id).send('The Bot is online.');
				}
				console.log(`Logged in as: ${bot.user.tag}`);
				require('./timers'); // eslint-disable-line global-require
			} else {
				console.log('Server id you entered doesn\'t exist.');
				process.exit();
			}
		} catch (error) {
			console.log('One of the ids in admin_commands_channels and status_updates_channels don\'t exist.');
			process.exit();
		}
	}
});

bot.on('messageCreate', async (message) => {
	try {
		if (message.author.id != bot.user.id) {
			if (message?.guild?.id == server_id) {
				if (status_updates_channels.includes(message.channel.id) || admin_commands_channels.includes(message.channel.id)) {
					if (message.content.startsWith('$') || (message.content.startsWith('```') && message.content.endsWith('```'))) {
						if (!(message.content.startsWith('```') && message.content.endsWith('```'))) {
							if (message?.member) {
								console.log(message.member.displayName, ':', message.content);
							} else {
								console.log(message.author.username, ':', message.content);
							}
						} else {
							if (message?.member) {
								console.log(message.member.displayName, ': $status_update');
							}
							console.log(message.author.username, ': $status_update');
						}
						if (status_updates_channels.includes(message.channel.id)) {
							await message.react(attended_character);
							if (message.content.startsWith('```')) {
								await commands.status_update(message);
							} else {
								const split_message = message.content.split(' ');
								switch (split_message[0]) {
								case '$ping':
									await commands.ping(message);
									break;
								case '$version':
									await commands.version(message);
									break;
								case '$help':
									await commands.user_help(message);
									break;
								case '$stats':
									await commands.stats(message);
									break;
								case '$update_nickname':
									await commands.update_nickname(message);
									break;
								case '$weekly_stats_all':
									await commands.weekly_stats_all(message);
									break;
								case '$take_leave':
									await commands.take_leave(message);
									break;
								case '$get_meeting_absentees_list':
									await commands.get_meeting_absentees_list(message);
									break;
								default:
									await message.react(fail_character);
									await message.reply('Are you stupid. Stop speaking the language which I dont understand.');
									break;
								}
							}
						} else if (admin_commands_channels.includes(message.channel.id)) {
							await message.react(attended_character);
							if (message.content.startsWith('```')) {
								await commands.status_update(message);
							} else {
								const split_message = message.content.split(' ');
								switch (split_message[0]) {
								case '$ping':
									await commands.ping(message);
									break;
								case '$version':
									await commands.version(message);
									break;
								case '$admin_help':
									await commands.admin_help(message);
									break;
								case '$user_help':
									await commands.user_help(message);
									break;
								case '$update_nickname':
									await commands.update_nickname(message);
									break;
								case '$update_nickname_with_id':
									await commands.update_nickname_with_id(message);
									break;
								case '$stats':
									await commands.stats(message);
									break;
								case '$weekly_stats_all':
									await commands.weekly_stats_all(message);
									break;
								case '$take_leave':
									await commands.take_leave(message);
									break;
								case '$show_all_ids':
									await commands.show_all_ids(message);
									break;
								case '$show_id':
									await commands.show_id(message);
									break;
								case '$edit_user':
									await commands.edit_user(message);
									break;
								case '$change_weekly_reset_day_number':
									await commands.change_weekly_reset_day_number(message);
									break;
								case '$edit_id':
									await commands.edit_id(message);
									break;
								case '$add_user':
									await commands.add_user(message);
									break;
								case '$add_id':
									await commands.add_id(message);
									break;
								case '$get_meeting_absentees_list':
									await commands.get_meeting_absentees_list(message);
									break;
								case '$total_reset':
									await commands.total_reset(message);
									break;
								case '$weekly_reset':
									await commands.weekly_reset(message);
									break;
								case '$monthly_reset':
									await commands.monthly_reset(message);
									break;
								case '$delete_user':
									await commands.delete_user(message);
									break;
								case '$delete_all':
									await commands.delete_all(message);
									break;
								case '$delete_id':
									await commands.delete_id(message);
									break;
								case '$backup':
									await commands.backup(message);
									break;
								case '$load_backup':
									await commands.load_backup(message);
									break;
								case '$delete_backup':
									await commands.delete_backup(message);
									break;
								case '$shutdown':
									await commands.shutdown(message);
									break;
								default:
									await message.react(fail_character);
									await message.reply('Are you stupid. Stop speaking the language which I dont understand.');
									break;
								}
							}
						}
					}
				}
			}
		}
	} catch (error) {
		console.log('-------------------------------------------------------');
		console.log(error);
		console.log('-------------------------------------------------------');
		await message.react(repair_character);
		await message.reply('Bot\'s brain screw has become loose. Error occured with the bot. Please consult the bot-dev once about this message.');
	}
});

bot.on('messageDelete', async (message) => {
	try {
		if (admin_commands_channels.includes(message.channel.id) || status_updates_channels.includes(message.channel.id)) {
			if (message.content.startsWith('```') && message.content.endsWith('```')) {
				const user = message.author;
				db[user.id].weekly_updates_count -= 1;
				db[user.id].monthly_updates_count -= 1;
				await message.channel.send(`<@${message.author.id}> is acting stupid and has deleted a status update message. Reducing 1 status update from <@${message.author.id}> entry.`);
				await message.channel.send('**The following content has been deleted by his stupidity**');
				await message.channel.send(message.content);
			} else if (message.content.startsWith('$')) {
				await message.channel.send(`<@${message.author.id}> is acting stupid and has deleted a bot command.`);
				await message.channel.send('**The following command has been deleted by him**');
				await message.channel.send(message.content);
			}
		}
	} catch (error) {
		console.log('-------------------------------------------------------');
		console.log(error);
		console.log('-------------------------------------------------------');
		await message.react(repair_character);
		await message.reply('Bot\'s brain screw has become loose. Error occured with the bot. Please consult the bot-dev once about this message.');
	}
});

bot.on('messageUpdate', async (old_message, message) => {
	try {
		if (admin_commands_channels.includes(old_message.channel.id) || status_updates_channels.includes(old_message.channel.id)) {
			if (old_message.content.startsWith('```') && old_message.content.endsWith('```')) {
				await message.channel.send(`<@${old_message.author.id}> has updated his status update message.`);
				await message.channel.send(old_message.content);
				await message.channel.send(message.content);
			} else if (old_message.content.startsWith('$')) {
				await message.channel.send(`<@${old_message.author.id}> has updated a bot command message.`);
				await message.channel.send(`\`\`\`${old_message.content}\`\`\``);
				await message.channel.send(`\`\`\`${message.content}\`\`\``);
			}
		}
	} catch (error) {
		console.log('-------------------------------------------------------');
		console.log(error);
		console.log('-------------------------------------------------------');
		await message.react(repair_character);
		await message.reply('Bot\'s brain screw has become loose. Error occured with the bot. Please consult the bot-dev once about this message.');
	}
});

bot.login(process.env.CLIENT_TOKEN);
