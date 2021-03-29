import { GetStaticProps } from 'next';

import Head from 'next/head';
import { SubscribeButton } from '../components/SubscribeButton';
import { stripe } from '../services/stripe';

import styles from './home.module.scss';

// Client-side - Quando não precisamos de indexação, comentário em um post de blog por exemplo
// server-side - indexação e dados dinâmicos em tempo real
// Static side Generation - Compartilhar com todas as pessoas o mesmo html

//Post de um blog
// Conteudo (SSG)
// Comentarios (CS)


interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  }
}

export default function Home({product}: HomeProps ){
  return (
    <>
      <Head>
        <title>Home | ignews</title>  
      </Head>  
      
     <main className={styles.contentContainer}>
       <section className={styles.hero}>
        <span>👏 Hey, welcome</span>
        <h1>News about the <span>React</span> world.</h1>
        <p>
          Get Acess to all the publications <br/>
          <span>for {product.amount} month</span>
        </p>
        <SubscribeButton priceId={product.priceId} />
       </section>

       <img src="/images/avatar.svg" alt="Girl coding"/>
     </main>
    </>
  )
}

//todo código digitado nessa função irá ser rodado no servidor
//node do próprio next e não no browser

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1IZJFJES8OP1EeuHo64zMsja')
  
  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price.unit_amount / 100),
  };
  
  return {
    props: {
      product,
    }, 
    revalidate: 60 * 60 * 24 // 24 hours
  }
}