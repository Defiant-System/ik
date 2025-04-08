
class Fighter {
	constructor(cfg) {
		let { arena } = cfg;

		this.arena = arena;
		this.asset = arena.assets.fighter;

		this.size = 144;
		this.top = 310;
		this.left = 400;
		this.flip = 1;

		// animation frames
		this.sheet = {
			name: "stand",
			strip: Assets.strips.stand,
			duration: 120,
			speed: 120,
			index: 0,
		};
	}

	move(name) {
		if (this.sheet.name === name) return;
		this.sheet.name = name;
		this.sheet.strip = Assets.strips[name];
		this.sheet.duration = this.sheet.speed;
		this.sheet.index = 0;
	}

	update(delta) {
		let { strip, duration } = this.sheet,
			len = strip.length;
		this.sheet.duration -= delta;
		if (this.sheet.duration < 0) {
			this.sheet.duration = (this.sheet.duration + this.sheet.speed) % this.sheet.speed;
			this.sheet.index++;

			if (this.sheet.index > len-1) {
				if (!["stand", "walk"].includes(this.sheet.name)) {
					this.move("stand");
				}
				this.sheet.index = 0;
			}

			let frame = strip[this.sheet.index];
			if (frame.dx !== undefined) this.left += (frame.dx * this.flip);
			if (frame.d) this.sheet.duration = frame.d;
			if (frame.flip) this.flip *= -1;
		}
	}

	render(ctx) {
		let sheet = this.sheet,
			{ x, y, w, h } = sheet.strip[sheet.index],
			sw = this.size,
			sh = this.size;
		// console.log(x, y, w, h );
		ctx.save();
		if (this.flip < 0) {
			ctx.translate(this.left+sw, 0);
			ctx.scale(-1, 1);
			ctx.drawImage(this.asset.img, x, y, w, h, 0, this.top, sw, sh);
			ctx.setTransform(1,0,0,1,0,0);
		} else {
			ctx.drawImage(this.asset.img, x, y, w, h, this.left, this.top, sw, sh);
		}
		ctx.restore();
	}
}
