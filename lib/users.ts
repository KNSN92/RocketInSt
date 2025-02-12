export function combinateUserName(name?: string | null, nickname?: string | null) {
    if(name && nickname) {
        return `${nickname}(${name})`;
    } else if(name) {
        return name;
    } else if(nickname) {
        return nickname;
    } else {
        return "???";
    }
}
