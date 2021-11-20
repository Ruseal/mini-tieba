export default () => {
  return (time) => {
    const num =
      (new Date().getTime() - new Date(time).getTime()) /
      1000 /
      60 /
      60 /
      24 /
      365;
    return Math.round(num * 100) / 100 + "年";
  };
}