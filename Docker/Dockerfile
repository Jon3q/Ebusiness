FROM ubuntu:24.04

ARG DEBIAN_FRONTEND=noninteractive

# Install core dependencies
RUN apt-get update && \
    apt-get install -y software-properties-common && \
    add-apt-repository ppa:deadsnakes/ppa && \
    apt-get update && \
    apt-get install -y \
    python3.10 \
    python3.10-venv \
    python3.10-dev \
    python3-pip \
    openjdk-8-jdk \
    curl \
    unzip \
    zip && \
    apt-get clean

# Link python -> python3.10
RUN ln -sf /usr/bin/python3.10 /usr/bin/python && \
    ln -sf /usr/bin/python3.10 /usr/bin/python3

#Kotlin
RUN curl -sSL https://api.github.com/repos/JetBrains/kotlin/releases/latest \
    | grep "browser_download_url.*kotlin-compiler.*zip" \
    | cut -d '"' -f 4 \
    | xargs curl -L -o kotlin.zip && \
    unzip kotlin.zip -d /opt && \
    rm kotlin.zip && \
    ln -s /opt/kotlin-compiler-*/bin/kotlinc /usr/bin/kotlinc && \
    ln -s /opt/kotlin-compiler-*/bin/kotlin /usr/bin/kotlin

# Gradle
RUN curl -s https://services.gradle.org/versions/current \
    | grep -oP '(?<="version" : ")[^"]+' \
    | xargs -I {} sh -c 'curl -L https://services.gradle.org/distributions/gradle-{}-bin.zip -o gradle.zip && \
                         unzip gradle.zip -d /opt/gradle && \
                         rm gradle.zip && \
                         ln -s /opt/gradle/gradle-{}/bin/gradle /usr/bin/gradle'

# Set PATH just in case
ENV PATH="${PATH}:/opt/gradle/gradle*/bin:/opt/kotlin-compiler*/bin"

# Create project directory
WORKDIR /app

# Copy build.gradle.kts
RUN mkdir -p /app/src/main/kotlin && \
    echo 'plugins {\n\
        kotlin("jvm") version "1.9.22"\n\
        application\n\
    }\n\
    repositories {\n\
        mavenCentral()\n\
    }\n\
    dependencies {\n\
        implementation("org.jetbrains.kotlin:kotlin-stdlib")\n\
        implementation("org.xerial:sqlite-jdbc:3.44.1.0")\n\
    }\n\
    application {\n\
        mainClass.set("MainKt")\n\
    }' > build.gradle.kts

# Add sample Main.kt
RUN echo 'fun main() {\n\
    println("Hello world of Kotlin and SQLite!")\n\
}' > src/main/kotlin/Main.kt

# Preload dependencies (optional)
RUN gradle build --no-daemon

CMD ["bash"]