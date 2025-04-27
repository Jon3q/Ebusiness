package com.example.bot

import dev.kord.core.Kord
import dev.kord.core.event.message.MessageCreateEvent
import dev.kord.core.on
import dev.kord.common.entity.Snowflake
import dev.kord.gateway.Intent
import dev.kord.gateway.PrivilegedIntent
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.application.*
import io.ktor.server.routing.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.github.cdimascio.dotenv.Dotenv

// Data class representing an item in the catalog
data class Item(val title: String, val cost: Double, val type: String)

// Catalog manager for storing and querying items
class Inventory {
    private val itemList = mutableListOf<Item>()

    fun add(item: Item) {
        itemList.add(item)
    }

    fun fetchTypes(): List<String> = itemList.map { it.type }.distinct()

    fun fetchItemsByType(type: String): List<Item> = itemList.filter { it.type == type }
}

// Entry point for the application
suspend fun main() {
    val env = Dotenv.load()
    val botToken = env["DISCORD_BOT_TOKEN"]
    val discordChannel = env["CHANNEL_ID"]

    val inventory = Inventory().apply {
        add(Item("banana", 0.99, "groceries"))
        add(Item("capybara", 120.0, "animals"))
        add(Item("croissant", 2.20, "groceries"))
        add(Item("elephant plush", 40.5, "toys"))
        add(Item("notebook", 5.5, "stationery"))
    }

    println("Launching Discord integration...")
    val client = Kord(botToken)

    client.on<MessageCreateEvent> {
        if (message.author?.isBot != false) return@on
        val userInput = message.content.lowercase()

        when {
            userInput == "!types" -> {
                val types = inventory.fetchTypes()
                message.channel.createMessage("Available types: ${types.joinToString(", ")}")
            }

            userInput.startsWith("!items ") -> {
                val type = userInput.removePrefix("!items ").trim()
                val results = inventory.fetchItemsByType(type)
                if (results.isEmpty()) {
                    message.channel.createMessage("No items found for '$type'. Try `!types` to see valid categories.")
                } else {
                    val response = results.joinToString("\n") { "${it.title} – $${it.cost}" }
                    message.channel.createMessage("Items in '$type':\n$response")
                }
            }
        }

        println("User ${message.author?.tag} said: ${message.content}")
    }

    embeddedServer(Netty, port = 8080) {
        messageApi(client, discordChannel)
    }.start(wait = false)

    client.login {
        @OptIn(PrivilegedIntent::class)
        intents += Intent.MessageContent
    }
}

// Defines a simple API route that allows sending a message to a Discord channel
fun Application.messageApi(botClient: Kord, channelId: String) {
    routing {
        post("/message") {
            val msg = call.receive<String>()
            botClient.rest.channel.createMessage(Snowflake(channelId)) {
                content = msg
            }
            call.respond("Message successfully sent to channel $channelId.")
        }
    }
}
