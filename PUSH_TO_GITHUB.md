# GitHub에 푸시하는 명령어

## 1. GitHub에서 저장소 생성
https://github.com/new 에서 새 저장소를 만드세요.

## 2. 아래 명령어 실행 (YOUR_USERNAME과 YOUR_REPO_NAME을 실제 값으로 변경)

```powershell
# 원격 저장소 추가
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# 브랜치 이름을 main으로 변경
git branch -M main

# GitHub에 푸시
git push -u origin main
```

## 예시:
```powershell
git remote add origin https://github.com/vanitas0126/portfolio.git
git branch -M main
git push -u origin main
```

## 인증
- GitHub에서 Personal Access Token이 필요할 수 있습니다
- 비밀번호 대신 토큰을 사용하세요
- 토큰 생성: GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)

