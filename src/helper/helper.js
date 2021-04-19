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

  progressRank(exp) {
    if (exp >= 150000) {
      return 100
    } else if (exp >= 5000) {
      return ((exp - 5000) / 145000) * 100
    } else if (exp >= 3000) {
      return ((exp - 3000) / 2000) * 100
    } else if (exp >= 1500) {
      return ((exp - 1500) / 1500) * 100
    } else if (exp >= 600) {
      return ((exp - 600) / 900) * 100
    } else {
      return (exp / 600) * 100
    }
  }
}

export default Helpers