class Helpers {
  showRank(exp) {
    let rank = 'นักเรียนใหม่'
    if (exp >= 150000) {
      rank = 'อธิการบดี'
    } else if (exp >= 5000) {
      rank = 'ศาสตราจารย์'
    } else if (exp >= 3000) {
      rank = 'อาจารย์'
    } else if (exp >= 1500) {
      rank = 'ครูฝึกสอน'
    } else if (exp >= 600) {
      rank = 'รุ่นพี่'
    }

    return rank
  }
}

export default Helpers