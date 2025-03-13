// show.ts 文件

export class CountdownTimer {
    private endTime: Date;
    private intervalId: NodeJS.Timeout | null = null;

    constructor(endTime: Date) {
        this.endTime = endTime;
    }

    public start(callback: (days: number, hours: number, minutes: number, seconds: number) => void): void {
        this.intervalId = setInterval(() => {
            const now = new Date();
            const distance = this.endTime.getTime() - now.getTime();

            // 计算天数、小时数、分钟数和秒数
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // 使用回调函数来更新倒计时显示
            callback(days, hours, minutes, seconds);

            // 如果倒计时结束，清除定时器
            if (distance < 0) {
                clearInterval(this.intervalId!);
                console.log('倒计时结束!');
                callback(0, 0, 0, 0);
            }
        }, 1000);
    }

    public stop(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            console.log('倒计时已停止');
        }
    }
}
