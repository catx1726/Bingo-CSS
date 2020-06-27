<template>
    <main>
        <div class="card-container">
            <div class="title-box">
                <div class="title">123</div>
                <div class="time">2020年4月27日</div>
            </div>
        </div>
    </main>
</template>

<style lang="scss" scoped>
.card-container {
    display: flex;
    width: 300px;
    .title-box {
        display: flex;
        flex-direction: row;
        width: 300px;
        background-color: #95e6de;
        justify-content: space-around;
        align-items: end;
        overflow: hidden;
        .title {
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
        }
        .time {
            flex-shrink: 0;
        }
    }
}
</style>
