const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals: { GoalFollow, GoalBlock } } = require('mineflayer-pathfinder');
const { Server } = require('socket.io');
const { createServer } = require('http');
const keypress = require('keypress');

const httpServer = createServer();
const io = new Server(httpServer, { cors: { origin: "*" } });

const bot = mineflayer.createBot({
  host: 'your server',
  port: 25565, // default port 
  username: 'your username',
  auth: 'microsoft' //mojang or offline
});

bot.loadPlugin(pathfinder);

bot.once('spawn', () => {
  bot.chat("Bot is ready");
});

io.on('connection', (socket) => {
  console.log('GUI connected');

  socket.on('move', ({ direction, state }) => {
    bot.setControlState(direction, state);
  });

  socket.on('chatCommand', (command) => {
    bot.chat(command);
  });

  socket.on('tpa', (target) => {
    bot.chat(`/tpa ${target}`);
  });

  socket.on('dropInventory', () => {
    bot.chat("Dropping all items");
    for (const item of bot.inventory.items()) {
      bot.tossStack(item).catch(err => bot.chat("Errore drop: " + err.message));
    }
  });

  socket.on('followNearest', () => followNearestPlayer());

  socket.on('rotate', ({ yaw, pitch }) => {
    bot.look(yaw, pitch, true);
  });

  socket.on('eat', () => {
    bot.chat("eating");
    bot.activateItem();
  });


  socket.on('attack', () => {
    const target = bot.nearestEntity(entity => entity.type === 'player' && entity.username !== bot.username);
    if (target) {
      bot.attack(target);
    } else {
      bot.chat("No target found");
    }
  });

  socket.on('afk1', () => {
    const movements = new Movements(bot);
    movements.allowDigging = false;
    bot.pathfinder.setMovements(movements);
    bot.chat("Going to AFK 1...");
    bot.pathfinder.setGoal(new GoalBlock(your, coords), true);
  });

  socket.on('afk2', () => {
    const movements = new Movements(bot);
    movements.allowDigging = false;
    bot.pathfinder.setMovements(movements);
    bot.chat("Going to AFK 2...");
    bot.pathfinder.setGoal(new GoalBlock(your, coords), true);
  });

  socket.on('afk3', () => {
    const movements = new Movements(bot);
    movements.allowDigging = false;
    bot.pathfinder.setMovements(movements);
    bot.chat("Going to AFK 3...");
    bot.pathfinder.setGoal(new GoalBlock(your, coords), true);
  });
});

function followNearestPlayer() {
  const playerFilter = entity => entity.type === 'player';
  const playerEntity = bot.nearestEntity(playerFilter);

  if (!playerEntity) {
    bot.chat('No player found.');
    setTimeout(followNearestPlayer, 5000);
    return;
  }

  bot.chat(`Following ${playerEntity.username}`);
  const movements = new Movements(bot);
  bot.pathfinder.setMovements(movements);
  bot.pathfinder.setGoal(new GoalFollow(playerEntity, 1), true);
}

httpServer.listen(3001, () => console.log('Bot running on port 3001'));
